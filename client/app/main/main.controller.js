'use strict';

angular.module('edumaterialApp')
  .controller('MainCtrl', function ($scope, $http, Auth ,$location,suggest, $sce,main,$timeout, medlineplus, $window,article,rating) {
    
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
      rdftype:'depth_of_coverage', name:'Depth of Coverage',value:0
    },{
      rdftype:'comprehensiveness', name:'Comprehensiveness',value:0
    },{
      rdftype:'relevancy', name:'Relevancy',value:0
    },{
      rdftype:'accuracy', name:'Accuracy',value:0
    },{
      rdftype:'educational_level', name:'Educational level',value:0
    },{
      rdftype:'validity', name:'Validity',value:0
    }];
    Auth.rating_criteria=$scope.rating;

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
    
    function plainText(text) {
      return String(text).replace(/<[^>]+>/gm, '');
    }
    


    //did you mean? function
    // $scope.suggest = function(suggestion) {
    //   $scope.queryTerm = suggestion;
    //   $scope.searchQuery();
    // };

    //===autocomple helpers===//
    $scope.getSuggestions = function(val) {
      return suggest.for(val);
    };


    //auto search when a term is selected
    $scope.onComplete=function(item,model,label){
      $scope.searchQuery();
    };


    //fetch whole article and rate it
    $scope.toggleArticle = function(i) {

      if (i>-1) {

        $scope.showArticle = true;
        $scope.frameHeight=$window.innerHeight-50;
        $scope.mobile=($window.innerWidth<700)?true:false; //set type to mobile if screen is less than 700px
        $scope.doc = $scope.results[i];
        $scope.doc.pos=i;
        $scope.doc.rating=$scope.doc.rating||[];
        $scope.doc.iframe='';

        
        // animation & double scrollbar fix
        $timeout(function() {
          $scope.doc.iframe = renderContent();
          document.querySelector('body').style.overflowY = $scope.showArticle ? 'hidden' : 'visible';
          }, 900);
        

      }
      else {
        //when article closed add rating (if user is loggedIn)
        if($scope.isLoggedIn) {
          main.setRating($scope.doc.rating);
         console.log(main.userRated);
        }
        
        
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
    
    var processData = function(){
            
      //article desc      
      main.setArticle({
        title:plainText($scope.doc.title),
        snippet:plainText($scope.doc.FullSummary||$scope.doc.snippet),
        date:new Date().toISOString(),
        url:$scope.doc.url,
        websource:$scope.curSource.value,
        source:plainText($scope.doc.organizationName||''),
        mesh:plainText($scope.doc.mesh||''),
        lang:'English',
        altTitle:plainText($scope.doc.altTitle||''),
        categories:plainText($scope.doc.groupName||''),
        wordcount:$scope.doc.wordcount||''
      });
              
        
      //rank node info
      main.setRank({
        position:$scope.doc.pos,
        total:$scope.total,
        date:new Date().toISOString(),
        query:$scope.queryTerm
      });
      
        
      rating.load({url:$scope.doc.url}).then(function(res){
        var rating=res.data.data[0];
        
        console.log( rating);
        $scope.doc.rating=[];
        for (var i = 0; i < 6; i++) {
          $scope.doc.rating[i]={
            value:0
          };
        }
        
          $scope.doc.rating[0].value=rating.depth_of_coverage.value;
          $scope.doc.rating[1].value=rating.comprehensiveness.value;
          $scope.doc.rating[2].value=rating.relevancy.value;
          $scope.doc.rating[3].value=rating.accuracy.value;
          $scope.doc.rating[4].value=rating.educational_level.value;
          $scope.doc.rating[5].value=rating.validity.value;
   
        console.log($scope.doc.rating);
      });
        
              
        /*** Enrichment stuff ***/
        
        //load the article
        // $http.get('/api/wikipedia/article/' + encodeURI(title), {
        //   cache: true
        // }).then(function(response) {
        //   //http://www.nlm.nih.gov/medlineplus
        //   $scope.doc.fetched = response.data.text['*'];
        // }).then(function() {
        // });
        
        
      //start parallel processing :)
      main.editArticle();
      
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
            data = '<base target="_blank" /><iframe style="width:100%;height:'+$scope.frameHeight+'px;" class="embed-responsive-item" src="' + $scope.doc.url + '"sandbox="allow-same-origin"></iframe>';
          }

          break;
        case 'wikipedia':
          $scope.doc.url='http://en.wikipedia.org/wiki/'+encodeURI($scope.doc.title).split('%20').join('_');
          
          data = '<base target="_blank" /><iframe style="width:100%;height:'+$scope.frameHeight+'px;" class="embed-responsive-item" src="'+$scope.doc.url+($scope.mobile?'?printable=yes':'')+'"></iframe>';

          break;
      }  
      
      
      //start processing data **find another way to call this function cause is a bit misleading here
      processData();

      //return iframes to the view
      return $sce.trustAsHtml(data);
    };

    //perform search
    $scope.searchQuery = function() {
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

        if(!response.data.message) {
          $scope.results=response.data.list;
          $scope.total=Number(response.data.count[0]);
          $scope.pageCount=Math.ceil($scope.total/$scope.itemsPerPage);
          if(($scope.total>$scope.itemsPerPage)&&$scope.results.retstart) $scope.currentPage=Math.ceil($scope.results.retstart[0]/$scope.itemsPerPage)+1;
        } else { 
          $scope.total = 0;
          $scope.results = [];
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
          
          
          //calculated rating for aggregated results
          article.getRated($scope.results).then(function(data) {
            console.log(data.data.data);
            for(var i=0,l=data.data.data; i<l.length; i++){
              
              for (var j = 0; j < $scope.results.length; j++) {
                if($scope.results[j].title===l[i].title.value) {
                  
                  
                  $scope.results[j].avgRating=l[i].ratingavg.value;
                }
              }
            }
          
          });
          
        } else { 
          $scope.total = 0;
          $scope.results = [];
        }
      });
      
    };
    

    //perform initialization
    init();
  
  
  
  });
