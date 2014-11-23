'use strict';

angular.module('edumaterialApp')
  .controller('WikipediaCtrl', function ($scope,$http) {
    
    //initialize setup vars
      
      $scope.itemsPerPage = 20
      $scope.currentPage = 1;
    function init(){
      //load from state or instantiate
      $scope.total=0;
      $scope.results=[];
    }
    init();
    
    $scope.suggest=function(suggestion){
      $scope.queryTerm=suggestion;
      $scope.searchTerm();
    };
    
    $scope.getSuggestions=function(val) {
      if(val.length>2) {
        return $http.get('/api/wikipedia/autocomplete/'+encodeURI(val), {cache:true,ignoreLoadingBar: true}).then(function(response){
          if(response.data.length>1) return response.data; else return [];
        });
      } else return [];
    };
    
    $scope.getArticle=function(title,i) {
      if(title) {
        return $http.get('/api/wikipedia/article/'+encodeURI(title), {cache:true}).then(function(response){
          $scope.results[i].show=true;
          $scope.results[i].fetched=response.data.text['*'];
        });
      } else return {};
    };
    
    $scope.searchTerm=function(page) {
      if(!page) $scope.currentPage = 1;
      $http.get('/api/wikipedia/search/'+encodeURI($scope.queryTerm)+'/'+($scope.currentPage-1)*$scope.itemsPerPage, {cache:true}).then(function(response){
        $scope.results = response.data.search;
        $scope.total = response.data.searchinfo.totalhits;
        $scope.pageCount=Math.ceil($scope.total / $scope.itemsPerPage);
        $scope.suggestion=response.data.searchinfo.suggestion;
      });
      
    };
    
  });
