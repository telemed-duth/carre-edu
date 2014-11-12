'use strict';

angular.module('edumaterialApp')
  .controller('DbpediaCtrl', function ($http,$scope) {
    $scope.message = 'Hello';
            
// $scope.selected = undefined;
//   $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
//   // Any function returning a promise object can be used to load values asynchronously
//   $scope.getLocation = function(val) {
//     return $http.get('http://iris.carre-project.eu:8080/api/medline/term'+encodeURI($scope.medlineQuery.term), {
//     }).then(function(response){
//       return response.data.results.map(function(item){
//         return item.formatted_address;
//       });
//     });
//   };
    
    $scope.searchTerm=function() {
      return $http.get('/api/dbpedia/term/'+encodeURI($scope.medlineTerm), {
      }).then(function(response){
        $scope.results=response;
        console.log($scope.results);
        
      });
    };
    
  });
