'use strict';

describe('Service: rdf', function () {

  // load the service's module
  beforeEach(module('edumaterialApp'));

  // instantiate service
  var rdf;
  beforeEach(inject(function (_rdf_) {
    rdf = _rdf_;
  }));

  it('should do something', function () {
    expect(!!rdf).toBe(true);
  });

});
