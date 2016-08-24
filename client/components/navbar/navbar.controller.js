'use strict';

angular.module('edumaterialApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth,$state,$window,$timeout) {
    
    $scope.isCollapsed = $window.innerWidth<768;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.login = Auth.login;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.query=Auth.searchQuery;
    Auth.notifyNavbar=function(){
      $scope.query=Auth.searchQuery;
    };
    //async process user before setting to scope
    if(Auth.token) {
      
      $timeout(function(){
        if(Auth.getCurrentUser.then) {
          Auth.getCurrentUser().then(function(){
            $scope.user = Auth.getCurrentUser();
          });
        } else {
          $scope.user = Auth.getCurrentUser();
        }
      },100)
      
    } else $scope.user = {};

    $scope.logout = function() {
      $scope.user={};
      Auth.logout();
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
    
  });