'use strict';

describe('Controller: MedlineplusCtrl', function () {

  // load the controller's module
  beforeEach(module('edumaterialApp'));

  var MedlineplusCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MedlineplusCtrl = $controller('MedlineplusCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
