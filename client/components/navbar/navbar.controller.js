'use strict';

angular.module('edumaterialApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    },{
      'title': 'MedlinePLUS',
      'link': '/medlineplus'
    },{
      'title': 'BioPortal',
      'link': '/bioportal'
    },{
      'title': 'DBpedia',
      'link': '/dbpedia'
    },{
      'title': 'Wikipedia',
      'link': '/wikipedia'
    },{
      'title': 'Compare',
      'link': '/compare',
      'admin':true
    },{
      'title': 'Sources',
      'admin':true,
      'link': '/sources'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;
    if(Auth.isLoggedIn && Auth.getCurrentUser().hasOwnProperty('$promise')) {
      $scope.getCurrentUser().$promise.then(function(user){
        $scope.user=user;
  
        //set image
        if(user.provider==='google') $scope.user.img=user.google.picture;
        if(user.provider==='twitter') $scope.user.img=user.twitter.profile_image_url;
        
      });
    }

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });