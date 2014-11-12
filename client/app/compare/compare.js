'use strict';

angular.module('edumaterialApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('compare', {
        url: '/compare',
        templateUrl: 'app/compare/compare.html',
        controller: 'CompareCtrl'
      });
  });