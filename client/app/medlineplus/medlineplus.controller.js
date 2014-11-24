'use strict';

angular.module('edumaterialApp')
  .controller('MedlineplusCtrl', function ($http,$scope,medlineplus,Auth) {

      
    //initialize setup vars
    $scope.results={};
    $scope.total=0;
    $scope.curPage=1;
    $scope.pageCount=0;
    $scope.maxPerPage=10;
    

    //Actual search function wrapper for my service
    $scope.searchTerm=function() {
      //call the service
      medlineplus.search($scope.curPage*$scope.maxPerPage,$scope.medlineTerm).then(function(response){
        
        $scope.results=response.data;
        $scope.total=Number($scope.results.count[0]);
        $scope.pageCount=Math.ceil($scope.total/$scope.maxPerPage);
        $scope.curPage=Number($scope.results.retstart[0]/$scope.maxPerPage);
        
        
      });
      
    };
    
     //check if global search term is present
    if(Auth.searchQuery){
      $scope.medlineTerm=Auth.searchQuery;
      $scope.searchTerm();
    }
    
    // $scope.searchTerm=function() {
    //   return $http.get('/api/medlineplus/term/'+encodeURI($scope.medlineTerm), {
    //   }).then(function(response){
    //     $scope.results=response.data;
    //     //console.log($scope.results);
        
    //   });
    // };
    
    
    
  });
