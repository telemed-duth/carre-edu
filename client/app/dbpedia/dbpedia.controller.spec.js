'use strict';

describe('Controller: DbpediaCtrl', function () {

  // load the controller's module
  beforeEach(module('edumaterialApp'));

  var DbpediaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DbpediaCtrl = $controller('DbpediaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
