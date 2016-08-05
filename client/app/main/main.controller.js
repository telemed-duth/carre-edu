'use strict';

angular.module('edumaterialApp')
  .controller('MainCtrl', function ($scope, $http, Auth, $location, $state, suggest, $sce, main, $timeout, medlineplus, $window, article, rating) {
    
    $scope.isLoggedIn=Auth.isLoggedIn;
    //async process user before setting to scope
    var user={};
    //async process user before setting to scope
    if(Auth.token) {
      // console.debug(Auth.token);
      if(Auth.getCurrentUser().$promise) Auth.getCurrentUser().then(function(){ user = Auth.getCurrentUser(); });
      else user = Auth.getCurrentUser();
    } else user = {};
    $scope.user = user;

    
    //set BETA
    $scope.beta=false;
    $scope.nextElement=function(){
      $scope.betaCurrentElement=$scope.betaCurrentElement||1;
      $scope.betaCurrentElement++;
      console.log($scope.betaCurrentElement);
      $scope.onComplete($scope.riskElements[$scope.betaCurrentElement],$scope.riskElements);
    };
    
    //auto fetch user rated articles when a carre user is logged in
    
    // if($scope.isLoggedIn()){
    //   Auth.getCurrentUser().then(function(d){
        
        
    //   console.log();
    //     $scope.user=d;
    //     Auth.user=d;
    //     //if(user.carre) getUserRatedArticles();
    //   });
      
    // }
    
    $scope.riskElements=[];
    
    suggest.riskelements().then(function(data){
      $scope.riskElements=data;
      console.log($scope.riskElements)
      if($scope.beta) {
        $scope.nextElement();
      }
    });

    
    
    $scope.docSources = [
      { label: 'Wikipedia', value: 'wikipedia' }
    ];
    $scope.curSource=$scope.docSources[0];
    if(Auth.language==='en') $scope.docSources.push({ label: 'MedlinePLUS', value: 'medlineplus' });
  
  
  /*****************************************************************/
  
  
      //initialize setup vars
    $scope.itemsPerPage = 10;
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
      
      
      if($state.params.searchquery) {
        //search
        $scope.queryTerm = $state.params.searchquery;
        $timeout(function(){$scope.searchQuery();},50);
      }
      
      if($state.params.eduid) {
        //search
        article.getById($state.params.eduid).then(function(res){
          console.debug(res);
          $scope.results = [{
            title:res.data.data[0].title.value,
            url:res.data.data[0].url.value,
            snippet:res.data.data[0].snippet.value,
          }]
          calculateRatedArticles(true);
        })
      }
      

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
      if($scope.beta) {
        $scope.queryTerm=item.name;
        console.log("OnComplete:",item,model);
      }
      if (item) {
        $scope.riskElement=item;
      }
      $scope.searchQuery();
    };


    //fetch whole article and rate it
    $scope.toggleArticle = function(i) {
      
      if (i>-1) {
        $scope.showArticle = true;
        $scope.frameHeight=$window.innerHeight-50;
        $scope.mobile=true;//($window.innerWidth<700)?true:false; //set type to mobile if screen is less than 700px
        $scope.doc = $scope.results[i];
        $scope.doc.pos=i;
        $scope.doc.rating=$scope.doc.rating||[];
        $scope.doc.iframe='';
        $scope.doc.riskElement=$scope.riskElement?$scope.riskElement.url:'';
        
        // animation & double scrollbar fix
        $timeout(function() {
          $scope.doc.iframe = renderContent();
          document.querySelector('body').style.overflowY = $scope.showArticle ? 'hidden' : 'visible';
          }, 900);
      }
      else {
        
        //when article closed add rating (if user is loggedIn)
        if($scope.isLoggedIn()) {
          main.setRating($scope.doc.rating).then(function(ratingId){
            // console.log(e);
            calculateRatedArticles();
          });
        }
        
        $scope.isCollapsed=false;
        $scope.doc={};
        $scope.doc.iframe = '';
        $scope.showArticle = false;
        
        // double scrollbar fix
        $timeout(function() {
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
        lang:Auth.language,
        altTitle:plainText($scope.doc.altTitle||''),
        categories:plainText($scope.doc.groupName||''),
        wordcount:$scope.doc.wordcount||'',
        riskElement:$scope.doc.riskElement
      });
              
      console.log($scope.doc.riskElement);
      //rank node info
      main.setRank({
        position:$scope.doc.pos,
        total:$scope.total,
        date:new Date().toISOString(),
        query:$scope.queryTerm,
        article_risk:$scope.doc.riskElement
      });
      
      if($scope.isLoggedIn()){
        
        rating.load({url:$scope.doc.url}).then(function(res){
          var rating=res.data.data[0];
          console.log('Rating Object is ');
          console.log(rating);
          
          $scope.doc.rating=[];
          for (var i = 0; i < 6; i++) {
            $scope.doc.rating[i]={
              value:0
            };
          }
          if(rating) {
            $scope.doc.rating[0].value=rating.depth_of_coverage.value||0;
            $scope.doc.rating[1].value=rating.comprehensiveness.value||0;
            $scope.doc.rating[2].value=rating.relevancy.value||0;
            $scope.doc.rating[3].value=rating.accuracy.value||0;
            $scope.doc.rating[4].value=rating.educational_level.value||0;
            $scope.doc.rating[5].value=rating.validity.value||0;
          }
     
        });
        
      }
        
              
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
      
      $scope.doc.title=plainText($scope.doc.title);
      switch ($scope.curSource.value) {
        
        case 'medlineplus':
          
          if($scope.mobile){
            //set the mobile html template
            data='<div style="background:#ffffff;height:'+$scope.frameHeight+'px; overflow-y:auto;">'+
            '<h2>'+$scope.doc.title+'</h2>'+
            '<p>'+$scope.doc.FullSummary+
            '</p></div>';
            
          } else {
            data = '<base target="_blank" /><iframe style="width:100%;height:'+$scope.frameHeight+'px;" class="embed-responsive-item" src="' + $scope.doc.url.replace('http://','https://') + '"sandbox="allow-same-origin"></iframe>';
          }

          break;
          
        case 'wikipedia':
          
          $scope.doc.iframeurl='/api/wikipedia/proxy/'+Auth.language+'/'+encodeURI($scope.doc.title).split('%20').join('_');
          $scope.doc.url='http://'+Auth.language+'.wikipedia.org/wiki/'+encodeURI($scope.doc.title).split('%20').join('_');
          
          data = '<base target="_blank" /><iframe style="width:100%;height:'+$scope.frameHeight+'px;" class="embed-responsive-item" src="'+$scope.doc.iframeurl+'"></iframe>';

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
            console.log('no source selected');
        } 
      }
    };


    //Actual search function wrapper for my service
    var searchMedlinePlus=function() {
      //call the service
      medlineplus.search(($scope.currentPage-1)*$scope.itemsPerPage,$scope.queryTerm,$scope.itemsPerPage).then(function(response){
        
        if(!response.data.message) {
          $scope.results=response.data.list;
          $scope.total=Number(response.data.count[0]);
          $scope.pageCount=Math.ceil($scope.total/$scope.itemsPerPage);
          if(($scope.total>$scope.itemsPerPage)&&$scope.results.retstart) {
            $scope.currentPage=Math.ceil($scope.results.retstart[0]/$scope.itemsPerPage)+1;
          }
          calculateRatedArticles();
          
        } else { 
          $scope.total = 0;
          $scope.results = [];
        }
          
      });
      
    };    
    
    
    //Actual search function wrapper for my service
    var searchWikiPedia=function() {
      //call the wikipedia 
      $http.get('/api/wikipedia/search/' + encodeURI($scope.queryTerm) + '/' +$scope.itemsPerPage+ '/' + ($scope.currentPage - 1) * $scope.itemsPerPage+'/'+Auth.language, {
        cache: true
      }).then(function(response) {
        
        if(response.data.search.length>0){
          $scope.results = response.data.search;
          $scope.total = response.data.searchinfo.totalhits;
          $scope.pageCount = Math.ceil($scope.total / $scope.itemsPerPage);
          $scope.suggestion = response.data.searchinfo.suggestion;
          
          calculateRatedArticles();
          
        } else { 
          $scope.total = 0;
          $scope.results = [];
        }
      });
      
    };
    

    //perform initialization
    init();
    
    var calculateRatedArticles=function(single){
                
      //calculated rating for aggregated results
      article.getRated($scope.results).then(function(data) {
        
        for(var i=0,l=data.data; i<l.length; i++){
          for (var j = 0; j < $scope.results.length; j++) {
            if(plainText($scope.results[j].title).trim()===l[i].title.value.trim()) {
              $scope.results[j].avgRating=l[i].ratingavg.value;
            }
          }
        }
          
        if(single) $timeout(function(){ $scope.toggleArticle(0); },100);
        
        if($scope.beta) {
          $scope.start();
        }
        
      });
      
    };

    $scope.start=function(){
      
        var left = ($scope.results.length>20)?20:$scope.results.length;
        var ticker = function() {
          console.log('At '+left)
          //run these commands
          $scope.toggleArticle(left-1)
          $timeout(function(){$scope.toggleArticle(-1)},4000)

          left -= 1
          if (left >= 0) {
            $timeout(ticker,5000);
            console.log('At :',left)
          } else if($scope.beta && left===-1) {
            $scope.nextElement();
          }
        }
                    

        ticker();
        
    }
  
  
  });
