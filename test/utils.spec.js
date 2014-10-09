'use strict';
describe('withDefaults', function (){
  it("should set properties that aren't already defined", function () {
    var defaults = { foo: 'bar', biz: 'baz' };
    expect(DUtils.withDefaults({ biz: 'buz'}, defaults)).toEqual({
      biz: 'buz',
      foo: 'bar'
    });
  });

  it("should gracefully handle an undefined first arg", function () {
    var defaults = { foo: 'bar', biz: 'baz' };
    var someNullObj;
    expect(DUtils.withDefaults(someNullObj, defaults)).toEqual(defaults);
  });
});

describe('get', function () {
  it('should return a value', function () {
    expect(DUtils.get('foo')).toBe('foo');
  });
  it('should return the result of a function', function () {
    var result,
        testFn = function () {
      return result;
    };
    expect(DUtils.get(testFn)).toBe(result);
  });
});
