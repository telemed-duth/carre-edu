'use strict';

angular.module('edumaterialApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth,$state,suggest,$rootScope) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },{
      'title': 'MedlinePLUS',
      'link': '/medlineplus',
      'admin':true
    },{
      'title': 'BioPortal',
      'link': '/bioportal',
      'admin':true
    },{
      'title': 'DBpedia',
      'link': '/dbpedia',
      'admin':true
    },{
      'title': 'Wikipedia',
      'link': '/wikipedia',
      'admin':true
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
    if(Auth.isLoggedIn && Auth.getCurrentUser().hasOwnProperty('$promise')) {
      $scope.getCurrentUser().$promise.then(function(user){
        $scope.user=user;
        
        console.log(user);
  
        //set image
        if(user.provider==='google') $scope.user.img=user.google.picture;
        else if(user.provider==='twitter') $scope.user.img=user.twitter.profile_image_url;
        else if(user.provider==='carre') $scope.user.img=user.carre.gravatar;
        else $scope.user.img='http://gravatar.com/avatar/3bc777082e578f5d41124e1055227d00?d=mm&s=96&r=G';
        
      });
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