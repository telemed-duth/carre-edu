'use strict';

describe('Service: enrichment', function () {

  // load the service's module
  beforeEach(module('carreEduApp'));

  // instantiate service
  var enrichment;
  beforeEach(inject(function (_enrichment_) {
    enrichment = _enrichment_;
  }));

  it('should do something', function () {
    expect(!!enrichment).toBe(true);
  });

});
