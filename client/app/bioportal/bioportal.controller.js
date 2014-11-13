'use strict';

angular.module('edumaterialApp')
  .controller('BioportalCtrl', function ($rootScope,$http,$scope,bioportal) {
    
    //initialize setup vars
    $scope.ontologies=[];
    $scope.ontology={};
    $scope.showSelector=false;
    $scope.results={};
    $scope.results.page=1;
    
    //serialize the array
    $scope.selectedAcronyms=function(){
      var arr=$scope.ontology.selected;
      var str='';
      for (var i = 0; i < arr.length; i++) {
        str+=arr[i].acronym+(arr.length-1===i?'':',');
      }
      // console.log(str);
      return str;
    };
    
    
    
    //Query my own service and cache the result!
    bioportal.ontologies().success(function(data){
      $scope.ontologies=data;
    });

    //Actual search function wrapper for my service
    $scope.searchTerm=function() {
    
      //call the service
      bioportal.search($scope.results.page,$scope.queryTerm,$scope.selectedAcronyms()).then(function(response){
        
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
