'use strict';

angular.module('edumaterialApp')
  .controller('BioportalCtrl', function ($http,$scope,bioportal) {
    $scope.medlineURL = 'http://www.nlm.nih.gov/medlineplus/';
    
    $scope.results={};
    $scope.results.page=1;
    $scope.searchTerm=function() {
      bioportal.search($scope.results.page,$scope.medlineTerm,'MEDLINEPLUS').then(function(response){
        
        $scope.results=response.data;
        if(($scope.results.collection.length<10) && ($scope.results.page>1) ){
          $scope.total=10*$scope.results.pageCount;
        } else {
          $scope.total=$scope.results.collection.length*$scope.results.pageCount||0;
        }
        console.log($scope.results);
        
      });
      // return $http.get('http://data.bioontology.org/search?page='
      // +$scope.results.page+'&ontologies=MEDLINEPLUS&apikey=&q='+encodeURI($scope.medlineTerm), {
      // })
    };

    
  });
