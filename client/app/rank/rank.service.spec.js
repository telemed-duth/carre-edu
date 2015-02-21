'use strict';

describe('Service: rank', function () {

  // load the service's module
  beforeEach(module('edumaterialApp'));

  // instantiate service
  var rank;
  beforeEach(inject(function (_rank_) {
    rank = _rank_;
  }));

  it('should do something', function () {
    expect(!!rank).toBe(true);
  });

});
