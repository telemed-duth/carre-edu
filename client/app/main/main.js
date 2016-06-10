'use strict';

angular.module('edumaterialApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('search', {
        url: '/search/:searchquery?',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('article', {
        url: '/article/:eduid?',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
  });