'use strict';

angular.module('edumaterialApp')
  .controller('DbpediaCtrl', function ($http,$scope) {
    
    //initialize setup vars
    function init(){
      $scope.itemsPerPage = 10
      $scope.currentPage = 1;
      $scope.total=0;
      $scope.results=[];
      $scope.filteredResults=[];
    }
    init();

    
    $scope.searchTerm=function() {
      init();
      return $http.get('/api/dbpedia/term/'+encodeURI($scope.queryTerm)+'/en', {cache:true}).then(function(response){
        $scope.results = response.data;
        $scope.total = $scope.results.length;
        $scope.pageCount=Math.ceil($scope.total / $scope.itemsPerPage);
        if($scope.total>0){
          $scope.$watch('currentPage + itemsPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
              end = begin + $scope.itemsPerPage;
            $scope.filteredResults = $scope.results.slice(begin, end);
          });
        }
      
      });
    };
    
  });
