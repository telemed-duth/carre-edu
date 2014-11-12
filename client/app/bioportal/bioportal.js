'use strict';

angular.module('edumaterialApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('bioportal', {
        url: '/bioportal',
        templateUrl: 'app/bioportal/bioportal.html',
        controller: 'BioportalCtrl'
      });
  });