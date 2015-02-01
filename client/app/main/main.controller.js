'use strict';

angular.module('edumaterialApp')
  .controller('MainCtrl', function ($scope, $http, Auth, $rootScope,$location,suggest, $sce, $timeout, medlineplus, $window) {
    
    $scope.isLoggedIn=Auth.isLoggedIn;

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


    //auto search when a term is selected
    $scope.onComplete=function(item,model,label){
      $scope.searchQuery();
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
        $scope.frameHeight=$window.innerHeight-50;
        $scope.mobile=($window.innerWidth<700)?true:false; //set type to mobile if screen is less than 700px
        $scope.doc = $scope.results[i];
        $scope.doc.rating=$scope.doc.rating||[];
        $scope.doc.iframe='';
        // console.log($scope.doc);
        // animation & double scrollbar fix
        $timeout(function() {
          $scope.doc.iframe = renderContent();
          document.querySelector('body').style.overflowY = $scope.showArticle ? 'hidden' : 'visible';
        }, 900);

        //load the article
        // $http.get('/api/wikipedia/article/' + encodeURI(title), {
        //   cache: true
        // }).then(function(response) {
        //   //http://www.nlm.nih.gov/medlineplus
        //   $scope.doc.fetched = response.data.text['*'];
        // }).then(function() {
        // });
      }
      else {
        $scope.isCollapsed=false;
        $scope.doc={};
        $scope.doc.iframe = '';
        $scope.showArticle = false;
        
        // double scrollbar fix
        $timeout(function() {
          // var style = document.querySelector('body').style.overflowY;
          document.querySelector('body').style.overflowY = $scope.showArticle ? 'hidden' : 'visible';
        }, 100);

      }

    };

    var renderContent = function() {
      var data='';
      switch ($scope.curSource.value) {
        case 'medlineplus':
          if($scope.mobile){
            //set the mobile html template
            data='<div style="background:#ffffff;height:'+$scope.frameHeight+'px; overflow-y:auto;">'+
            '<h2>'+$scope.doc.title+'</h2>'+
            '<p>'+$scope.doc.FullSummary+
            '</p></div>';
            
          } else {
            data = '<iframe style="width:100%;height:'+$scope.frameHeight+'px;" class="embed-responsive-item" src="' + $scope.doc.url + '"sandbox="allow-same-origin"></iframe>';
          }
          break;
        case 'wikipedia':
          data = '<iframe style="width:100%;height:'+$scope.frameHeight+'px;" class="embed-responsive-item" src="http://en.wikipedia.org/wiki/'
          +encodeURI($scope.doc.title).split('%20').join('_')+($scope.mobile?'?printable=yes':'')+'"sandbox="allow-same-origin"></iframe>';
          break;
      }  
      return $sce.trustAsHtml(data);
    }

    //perform search
    $scope.searchQuery = function() {
      console.log($scope.queryTerm);
      if($scope.queryTerm!=undefined&&$scope.queryTerm!==''){
        Auth.searchQuery=$scope.queryTerm;
        Auth.notifyNavbar();
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
      }
      
    };


    //Actual search function wrapper for my service
    var searchMedlinePlus=function() {
      //call the service
      medlineplus.search(($scope.currentPage-1)*$scope.itemsPerPage,$scope.queryTerm).then(function(response){
        if(response.data.message!=='no_results') {
          $scope.results=response.data.list;
          $scope.total=Number(response.data.count[0]);
          $scope.pageCount=Math.ceil($scope.total/$scope.itemsPerPage);
          if(($scope.total>$scope.itemsPerPage)&&$scope.results.retstart) $scope.currentPage=Math.ceil($scope.results.retstart[0]/$scope.itemsPerPage)+1;
        } else { 
          
          //try wikipedia
          $scope.curSource=$scope.docSources[1];
          searchWikiPedia();
        }
          
      });
      
    };    
    
    
    //Actual search function wrapper for my service
    var searchWikiPedia=function() {
      //call the wikipedia 
      $http.get('/api/wikipedia/search/' + encodeURI($scope.queryTerm) + '/' + ($scope.currentPage - 1) * $scope.itemsPerPage, {
        cache: true
      }).then(function(response) {
        if(response.data.search.length>0){
          $scope.results = response.data.search;
          $scope.total = response.data.searchinfo.totalhits;
          $scope.pageCount = Math.ceil($scope.total / $scope.itemsPerPage);
          $scope.suggestion = response.data.searchinfo.suggestion;
        } else { 
          
          //try medlineplus
          $scope.curSource=$scope.docSources[0];
          searchMedlinePlus();
        }
      });
      
    };
    

    //perform initialization
    init();
  
  
  
  });
