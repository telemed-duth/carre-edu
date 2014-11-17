'use strict';

describe('Service: medlineplus', function () {

  // load the service's module
  beforeEach(module('edumaterialApp'));

  // instantiate service
  var medlineplus;
  beforeEach(inject(function (_medlineplus_) {
    medlineplus = _medlineplus_;
  }));

  it('should do something', function () {
    expect(!!medlineplus).toBe(true);
  });

});
