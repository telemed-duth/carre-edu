'use strict';

describe('Service: main', function () {

  // load the service's module
  beforeEach(module('edumaterialApp'));

  // instantiate service
  var main;
  beforeEach(inject(function (_main_) {
    main = _main_;
  }));

  it('should do something', function () {
    expect(!!main).toBe(true);
  });

});
