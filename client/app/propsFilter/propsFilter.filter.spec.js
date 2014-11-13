'use strict';

describe('Filter: propsFilter', function () {

  // load the filter's module
  beforeEach(module('edumaterialApp'));

  // initialize a new instance of the filter before each test
  var propsFilter;
  beforeEach(inject(function ($filter) {
    propsFilter = $filter('propsFilter');
  }));

  it('should return the input prefixed with "propsFilter filter:"', function () {
    var objectArr = [{name:'angularjs'}];
    expect(propsFilter(objectArr)).toBe({name:'angularjs'});
  });

});
