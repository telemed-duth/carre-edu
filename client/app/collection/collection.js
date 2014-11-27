'use strict';

angular.module('edumaterialApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('collection', {
        url: '/collection',
        templateUrl: 'app/collection/collection.html',
        controller: 'CollectionCtrl'
      });
  });