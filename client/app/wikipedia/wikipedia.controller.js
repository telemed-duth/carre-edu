'use strict';

angular.module('edumaterialApp')
  .controller('WikipediaCtrl', function ($scope,$http,Auth,suggest) {
    
    //initialize setup vars
      $scope.itemsPerPage = 20
      $scope.currentPage = 1;
    function init(){
      //load from state or instantiate
      $scope.total=0;
      $scope.results=[];
      
      //check if global search term is present
      if(Auth.searchQuery){
        $scope.queryTerm=Auth.searchQuery;
        $scope.searchTerm();
      }
    }
    
    //did you mean? function
    $scope.suggest=function(suggestion){
      $scope.queryTerm=suggestion;
      $scope.searchTerm();
    };
    
    //===autocomple helpers===//
    $scope.getSuggestions=function(val) {
      return suggest.for(val);
    };
    $scope.onComplete=function(label){
      if(label) {
        $scope.queryTerm=label;
        $scope.searchTerm();
      }
    };

    
    //fetch whole article and rate it
    $scope.toggleArticle=function(i) {
      var doc=$scope.results[i];
      var title=doc.title;
      
      if(!doc.fetched) {
        //load the article
        if(title) {
          doc.loading=true;
          $http.get('/api/wikipedia/article/'+encodeURI(title), {cache:true}).then(function(response){
            doc.show=true;
            doc.fetched=response.data.text['*'];
            doc.loading=false;
          });
        }
      } else {
        //just toggle it
        doc.show=!doc.show;
        
      }
      
      
      
    };
    
    //perform search
    $scope.searchTerm=function(page) {
      if(!page) $scope.currentPage = 1;
      $http.get('/api/wikipedia/search/'+encodeURI($scope.queryTerm)+'/'+($scope.currentPage-1)*$scope.itemsPerPage, {cache:true}).then(function(response){
        $scope.results = response.data.search;
        $scope.total = response.data.searchinfo.totalhits;
        $scope.pageCount=Math.ceil($scope.total / $scope.itemsPerPage);
        $scope.suggestion=response.data.searchinfo.suggestion;
      });
      
    };
    
    
    //perform initialization
    init();
    
  });
