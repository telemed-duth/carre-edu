'use strict';

describe('Service: suggest', function () {

  // load the service's module
  beforeEach(module('edumaterialApp'));

  // instantiate service
  var suggest;
  beforeEach(inject(function (_suggest_) {
    suggest = _suggest_;
  }));

  it('should do something', function () {
    expect(!!suggest).toBe(true);
  });

});
