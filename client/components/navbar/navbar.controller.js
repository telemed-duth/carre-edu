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
      'title': 'Pubmed',
      'link': '/pubmed'
    },{
      'title': 'DBpedia',
      'link': '/dbpedia'
    },{
      'title': 'Sources',
      'admin':true,
      'link': '/sources'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });