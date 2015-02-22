'use strict';

describe('Service: jaroWinkler', function () {

  // load the service's module
  beforeEach(module('edumaterialApp'));

  // instantiate service
  var jaroWinkler;
  beforeEach(inject(function (_jaroWinkler_) {
    jaroWinkler = _jaroWinkler_;
  }));

  it('should do something', function () {
    expect(!!jaroWinkler).toBe(true);
  });

});
