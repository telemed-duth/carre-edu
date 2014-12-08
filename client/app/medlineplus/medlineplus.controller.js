'use strict';

angular.module('edumaterialApp')
  .controller('MedlineplusCtrl', function ($http,$scope,medlineplus,Auth) {

      
    //initialize setup vars
    $scope.results={};
    $scope.totalPagination=0;
    $scope.curPagePagination=1;
    $scope.pageCountPagination=0;
    $scope.maxPerPage=10;
    $scope.maxPagination=4;
    $scope.rotatePagination=false;
    
    //Actual search function wrapper for my service
    $scope.searchTerm=function() {
      //call the service
      medlineplus.search(($scope.curPagePagination-1)*$scope.maxPerPage,$scope.medlineTerm).then(function(response){
        console.log(response.data);
        $scope.results=response.data;
        $scope.totalPagination=Number($scope.results.count[0]);
        $scope.pageCountPagination=Math.ceil($scope.totalPagination/$scope.maxPerPage);
        $scope.curPagePagination=Math.ceil($scope.results.retstart[0]/$scope.maxPerPage)+1;
        
        
      });
      
    };
    
     //check if global search term is present
    if(Auth.searchQuery){
      $scope.medlineTerm=Auth.searchQuery;
      $scope.searchTerm();
    }
    
    
    $scope.max = 5;
    
    
    // $scope.searchTerm=function() {
    //   return $http.get('/api/medlineplus/term/'+encodeURI($scope.medlineTerm), {
    //   }).then(function(response){
    //     $scope.results=response.data;
    //     //console.log($scope.results);
        
    //   });
    // };
    
    
    
  });
