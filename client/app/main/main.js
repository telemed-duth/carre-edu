'use strict';

angular.module('edumaterialApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('main.preview', {
        url: '/article/{doc.title}',
        templateUrl: 'app/main/article_view.html'
      });
  });