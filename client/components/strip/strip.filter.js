'use strict';

angular.module('edumaterialApp')
  .filter('strip', function () {
    return function (input) {
      return String(input).replace(/<[^>]+>/gm, '');
    };
  });