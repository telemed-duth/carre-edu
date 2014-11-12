'use strict';

angular.module('edumaterialApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('medlineplus', {
        url: '/medlineplus',
        templateUrl: 'app/medlineplus/medlineplus.html',
        controller: 'MedlineplusCtrl'
      });
  });