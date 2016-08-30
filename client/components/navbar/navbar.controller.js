'use strict';

angular.module('edumaterialApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth,$state,$window) {
    
    $scope.isCollapsed = $window.innerWidth<768;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.login = Auth.login;
    $scope.isAdmin = Auth.isAdmin;
    $scope.query=Auth.searchQuery;
    Auth.notifyNavbar=function(){
      $scope.query=Auth.searchQuery;
    };
    
    $scope.logout = function() {
      $scope.user={};
      Auth.logout();
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
    
    //async process user before setting to scope
    Auth.isLoggedInAsync(function(data){
       console.log("NavbarCtrl Async login",data);
       if(data) $scope.user = Auth.getCurrentUser();
    })
    
    
    
  });