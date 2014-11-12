'use strict';

angular.module('edumaterialApp')
  .controller('BioportalCtrl', function ($rootScope,$http,$scope,bioportal) {
    
    
    $scope.medlineURL = 'http://www.nlm.nih.gov/medlineplus/';
    
    $scope.ontology={};
    $scope.ontology.selected={"name":"MedlinePlus Health Topics","acronym":"MEDLINEPLUS"};
    $scope.showSelector=false;
    // bioportal.ontologies().success(function(data){
    //   console.log('---Server Results----');
    //   console.log(data);
    // }).error(function(error){
    //   console.log(error);
    // });
    

    bioportal.ontologies().success(function(data){
      $scope.ontologies=data;
    });

    $scope.results={};
    $scope.results.page=1;
    $scope.searchTerm=function() {
      bioportal.search($scope.results.page,$scope.queryTerm,$scope.ontology.selected.acronym).then(function(response){
        
        $scope.results=response.data;
        if(($scope.results.collection.length<10) && ($scope.results.page>1) ){
          $scope.total=10*$scope.results.pageCount;
        } else {
          $scope.total=$scope.results.collection.length*$scope.results.pageCount||0;
        }
        console.log($scope.results);
        
      });
      
    };

    
  });
