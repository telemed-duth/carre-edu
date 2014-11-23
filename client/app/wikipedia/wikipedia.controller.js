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
    
    
    $scope.searchTerm=function(suggestion) {
      $http.get('/api/wikipedia/search/'+encodeURI(suggestion||$scope.queryTerm)+'/'+($scope.currentPage-1)*$scope.itemsPerPage, {cache:true}).then(function(response){
        $scope.results = response.data.search;
        $scope.total = response.data.searchinfo.totalhits;
        $scope.pageCount=Math.ceil($scope.total / $scope.itemsPerPage);
        $scope.suggestion=response.data.searchinfo.suggestion;

        
        // if($scope.total>0){
          
        // } else {
        
        // }
      
      });
    };
    
  });
