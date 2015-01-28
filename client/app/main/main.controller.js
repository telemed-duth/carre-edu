'use strict';

angular.module('edumaterialApp')
  .controller('MainCtrl', function ($scope, $http, Auth, $rootScope,$location,suggest, $sce, $timeout, medlineplus) {
    
    $scope.isLoggedIn=Auth.isLoggedIn;
    
    // $scope.searchQuery=function(){
    //   Auth.searchQuery=$scope.queryTerm;
    //   Auth.notifyNavbar();
    //   $scope.showSearch=false;
    //   // console.log($location.$$path);
    //   if($location.$$path!=='/home'&&$location.$$path!=='/'&&$location.$$path!=='/article') $state.forceReload();
    //   else $location.path('/medlineplus');
      
    // };
    
    
    
    
    $scope.onComplete=function(label){
      // if(label) {
      //   $scope.queryTerm=label;
      // }
      $scope.searchQuery();
    };
    
    $scope.riskElements=[];
    suggest.riskelements().then(function(data){
      $scope.riskElements=data;
    });
  $scope.docSources = [
    { label: 'MedlinePLUS', value: 'medlineplus' },
    { label: 'Wikipedia', value: 'wikipedia' }
  ];
  $scope.curSource=$scope.docSources[1];
  
  
  
  /*****************************************************************/
  
  
      //initialize setup vars
    $scope.itemsPerPage = 20
    $scope.currentPage = 1;
    
    $scope.rating=[{
      name:'Depth of Coverage',value:0
    },{
      name:'Comprehensiveness',value:0
    },{
      name:'Relevancy',value:0
    },{
      name:'Accuracy',value:0
    },{
      name:'Educational level',value:0
    },{
      name:'Validity',value:0
    }];

    function init() {
      //load from state or instantiate
      $scope.total = 0;
      $scope.results = [];

      //check if global search term is present
      if (Auth.searchQuery) {
        $scope.queryTerm = Auth.searchQuery;
        $scope.searchQuery();
      }
    }

    //did you mean? function
    $scope.suggest = function(suggestion) {
      $scope.queryTerm = suggestion;
      $scope.searchQuery();
    };

    //===autocomple helpers===//
    $scope.getSuggestions = function(val) {
      return suggest.for(val);
    };

    $scope.onComplete = function(label) {
      if (label) {
        $scope.queryTerm = label;
        $scope.searchQuery();
      }
    };
    // $scope.previewPanel='small';
    // $scope.togglePanel=function(){
    //   var height='400px';
    //   if($scope.previewPanel==='big') height='50px';
      
      
    //     document.querySelector('#document-preview').style.height = height;
    // };


    //fetch whole article and rate it
    $scope.toggleArticle = function(i) {

      if (i>-1) {

        $scope.showArticle = true;
        $scope.doc = $scope.results[i];
        $scope.doc.iframe='';
        $scope.doc.rating=$scope.doc.rating||[];
        var title = $scope.doc.title;
        
        // animation & double scrollbar fix
        $timeout(function() {
          $scope.doc.iframe = htmlSafe('http://en.wikipedia.org/wiki/' + encodeURI(title).split('%20').join('_'), true);
          document.querySelector('body').style.overflowY = $scope.showArticle ? 'hidden' : 'visible';
        }, 900);

        //load the article
        $http.get('/api/wikipedia/article/' + encodeURI(title), {
          cache: true
        }).then(function(response) {
          //http://www.nlm.nih.gov/medlineplus
          $scope.doc.fetched = response.data.text['*'];


        }).then(function() {
        });
      }
      else {
        $scope.isCollapsed=false;
        $scope.doc={};
        $scope.doc.iframe = htmlSafe('', false);
        $scope.showArticle = false;
        
        // double scrollbar fix
        $timeout(function() {
          // var style = document.querySelector('body').style.overflowY;
          document.querySelector('body').style.overflowY = $scope.showArticle ? 'hidden' : 'visible';
        }, 100);

      }

    };
    
    $scope.articleInfo="ICD-10 : 230444";
    $scope.articleRating="Information Quality";
    


    var htmlSafe = function(data, iframe) {
      var sandbox = '';
      if (iframe) {
        if ($scope.curSource.label==='MedlinePLUS') sandbox = 'sandbox="allow-same-origin"';
        data = '<iframe style="width:100%;" class="embed-responsive-item" src="' + data + '"' + sandbox + '></iframe>';
      }
      return $sce.trustAsHtml(data);
    }

    //perform search
    $scope.searchQuery = function(page) {
      Auth.searchQuery=$scope.queryTerm;
      Auth.notifyNavbar();
      if (!page) $scope.currentPage = 1;
      switch ($scope.curSource.value) {
        case 'medlineplus':
          searchMedlinePlus();
          break;
        case 'wikipedia':
          searchWikiPedia();
          break;
        
        default:
          searchWikiPedia();
      }  
      
      

    };


    //Actual search function wrapper for my service
    var searchMedlinePlus=function() {
      //call the service
      medlineplus.search(($scope.currentPage-1)*$scope.itemsPerPage,$scope.queryTerm).then(function(response){
        $scope.results=response.data.list;
        $scope.total=Number(response.data.count[0]);
        $scope.pageCount=Math.ceil($scope.total/$scope.itemsPerPage);
        $scope.currentPage=Math.ceil($scope.results.retstart[0]/$scope.itemsPerPage)+1;
      });
      
    };    
    
    
    //Actual search function wrapper for my service
    var searchWikiPedia=function() {
      //call the wikipedia 
      $http.get('/api/wikipedia/search/' + encodeURI($scope.queryTerm) + '/' + ($scope.currentPage - 1) * $scope.itemsPerPage, {
        cache: true
      }).then(function(response) {
        $scope.results = response.data.search;
        $scope.total = response.data.searchinfo.totalhits;
        $scope.pageCount = Math.ceil($scope.total / $scope.itemsPerPage);
        $scope.suggestion = response.data.searchinfo.suggestion;
      });
      
    };
    
     //check if global search term is present
    if(Auth.searchQuery){
      $scope.medlineTerm=Auth.searchQuery;
      $scope.searchTerm();
    }
    

    //perform initialization
    init();
  
  
  
  
  
  
  
  });
