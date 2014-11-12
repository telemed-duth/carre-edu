'use strict';

describe('Service: bioportal', function () {

  // load the service's module
  beforeEach(module('edumaterialApp'));

  // instantiate service
  var bioportal;
  beforeEach(inject(function (_bioportal_) {
    bioportal = _bioportal_;
  }));

  it('should do something', function () {
    expect(!!bioportal).toBe(true);
  });

});
