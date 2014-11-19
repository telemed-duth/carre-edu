'use strict';

angular.module('edumaterialApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('wikipedia', {
        url: '/wikipedia',
        templateUrl: 'app/wikipedia/wikipedia.html',
        controller: 'WikipediaCtrl'
      });
  });