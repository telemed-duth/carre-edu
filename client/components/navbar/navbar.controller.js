'use strict';

angular.module('edumaterialApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth,$state,suggest,$rootScope) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },{
      'title': 'MedlinePLUS',
      'link': '/medlineplus',
      'user':true
    },{
      'title': 'BioPortal',
      'link': '/bioportal',
      'user':true
    },{
      'title': 'DBpedia',
      'link': '/dbpedia',
      'user':true
    },{
      'title': 'Wikipedia',
      'link': '/wikipedia',
      'user':true
    },{
      'title': 'Collection',
      'link': '/collection',
      'admin':true
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.query=Auth.searchQuery;
    
    //async process user before setting to scope
    if(Auth.isLoggedIn && Auth.getCurrentUser().hasOwnProperty('$promise')) {
      $scope.getCurrentUser().$promise.then(function(user){
        $scope.user=user;
  
        //set image
        if(user.provider==='google') $scope.user.img=user.google.picture;
        else if(user.provider==='twitter') $scope.user.img=user.twitter.profile_image_url;
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
      console.log($location.$$path);
      if($location.$$path!=='/home'&&$location.$$path!=='/') $state.forceReload();
      else $location.path('/medlineplus');
      
    };
    

  });