'use strict';

angular.module('edumaterialApp')
  .controller('MainCtrl', function ($scope, $http, socket,$location,suggest,Auth,$rootScope) {
    
    $scope.isLoggedIn=Auth.isLoggedIn;
    
    $scope.searchQuery=function(){
      Auth.searchQuery=$scope.query;
      $scope.showSearch=false;
      // console.log($location.$$path);
      if($location.$$path!=='/home'&&$location.$$path!=='/'&&$location.$$path!=='/article') $state.forceReload();
      else $location.path('/medlineplus');
      
    };
    
    $scope.onComplete=function(label){
      if(label) {
        $scope.query=label;
        $scope.searchQuery();
      }
    };
    
    $scope.riskElements=suggest.riskelements();
    
  });
