// use Math to "mock" the fns provided by Khan Academy environment
cos = Math.cos;
atan = Math.atan;
abs = Math.abs;

describe('radialVelocity', function () {
  var listener = {x: 5, y: 5},
  velocity = 1;

  it('should be postive when moving towards the listener', function () {
    for (var y = 0; y < 10; y++) {
      for (var x = 0; x < 5; x++) {
        var source = {x: x, y: y};
        var v = DMath.radialVelocity(source, velocity, listener);
        // console.log(['source ',
        //               JSON.stringify(source),
        //               ' listener: ',
        //               JSON.stringify(listener),
        //               ' relative velocity of source: ',
        //               v].join(''));
        expect(v).toBeGreaterThan(0);
      }
    }
  });

  it('should be negative when moving away from the listener', function () {
    for (var y = 0; y < 10; y++) {
      for (var x = 6; x <= 10; x++) {
        var source = {x: x, y: y};
        var v = DMath.radialVelocity(source, velocity, listener);
        // console.log(['source ',
        //               JSON.stringify(source),
        //               ' listener: ',
        //               JSON.stringify(listener),
        //               ' relative velocity of source: ',
        //               v].join(''));
        expect(v).toBeLessThan(0);
      }
    }
  });

  it('should be zero when at the listener', function () {
    expect(DMath.radialVelocity(listener, velocity, listener))
    .toBe(0);
  });
});
