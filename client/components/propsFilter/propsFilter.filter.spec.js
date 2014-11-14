'use strict';

describe('Filter: propsFilter', function () {

  // load the filter's module
  beforeEach(module('edumaterialApp'));

  // initialize a new instance of the filter before each test
  var propsFilter;
  beforeEach(inject(function ($filter) {
    propsFilter = $filter('propsFilter');
  }));

  it('should return the object containing , Wonder kid', function () {
    var testArr = [
      {name:'Nick Portokallidis',age:28},
      {name:'Thanos Petrelis',age:38},
      {name:'Wonder kid',age:20},
      {name:'Bill Gates',age:55}
      ];
    //check for length of the result array
    expect( propsFilter(testArr,{age:'2'}).length ).toBe(2);
    expect( propsFilter(testArr,{age:'3'}).length ).toBe(1);
    expect( propsFilter(testArr,{name:'li'}).length ).toBe(2);
    expect( propsFilter(testArr,{name:'kid'}).length ).toBe(1);
    // expect( propsFilter(testArr,{'name':'kid'}) ).toBe( [{ name:'Wonder kid',age:20 }] );
  });

});
