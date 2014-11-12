'use strict';

describe('Controller: BioportalCtrl', function () {

  // load the controller's module
  beforeEach(module('edumaterialApp'));

  var BioportalCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BioportalCtrl = $controller('BioportalCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
