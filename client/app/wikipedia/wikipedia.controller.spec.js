'use strict';

describe('Controller: WikipediaCtrl', function () {

  // load the controller's module
  beforeEach(module('edumaterialApp'));

  var WikipediaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WikipediaCtrl = $controller('WikipediaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
