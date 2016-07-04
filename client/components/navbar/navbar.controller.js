'use strict';

angular.module('edumaterialApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth,$state,suggest,$rootScope) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.togglesidebar=function(){
      $rootScope.toggle_sidebar=!$rootScope.toggle_sidebar;
    };
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.query=Auth.searchQuery;
    Auth.notifyNavbar=function(){
      $scope.query=Auth.searchQuery;
    };
    //async process user before setting to scope
    if(Auth.isLoggedInAsync) {
      Auth.getCurrentUser().then(function(){
        $scope.user = Auth.getCurrentUser();
      });
    } else if(Auth.isLoggedIn()){
      $scope.user = Auth.getCurrentUser();
    } else {
      $scope.user = {};
      
    }

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
    
    //===autocomple helpers===//
    $scope.getSuggestions=function(val) {
      return suggest.for(val);
    };
    
    $scope.searchQuery=function(){
      Auth.searchQuery=$scope.query;
      $scope.showSearch=false;
      $state.forceReload();
      // console.log($location.$$path);
      // if($location.$$path!=='/home'&&$location.$$path!=='/') $state.forceReload();
      // else $location.path('/medlineplus');
      
    };
    
    

  });