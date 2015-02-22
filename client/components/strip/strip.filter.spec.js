'use strict';

describe('Filter: strip', function () {

  // load the filter's module
  beforeEach(module('edumaterialApp'));

  // initialize a new instance of the filter before each test
  var strip;
  beforeEach(inject(function ($filter) {
    strip = $filter('strip');
  }));

  it('should return the input prefixed with "strip filter:"', function () {
    var text = '<h1>Nick</h1>';
    expect(strip(text)).toBe('Nick');
  });

});
