'use strict';

angular.module('edumaterialApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('dbpedia', {
        url: '/dbpedia',
        templateUrl: 'app/dbpedia/dbpedia.html',
        controller: 'DbpediaCtrl'
      });
  });