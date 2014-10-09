/**
* This is an animation which demonstrates the Doppler effect: why sounds have a higher pitch as they approach you and
* lower as they move away, like a car driving by (or in this case, a spaceship).
*
* The top sine wave is the sound emitted by the spaceship which stays the same the whole itme.
*
* The bottom sine wave is the sound received by the girl with bunny ears, it starts of at a higher pitch than the spaceship's original sound and eventually
* falls below it.  You can see this because the waveform starts out more "compressed" than the original waveform (i.e. higher frequency & shorter wavelength)
* then ends up longer than the original.
*
* You can also see the change in frequency by looking at the red dots that are plotted on top of the listener.  The x axis is time and the y axis is
* frequency, where the middle of the canvas is equal to the original frequency.
*/

/**
* ////////////////////////////////////////////////
* Doppler Utils
* ////////////////////////////////////////////////
*/
// namespace for utility functions
var DUtils = {
  /**
  * Apply properties from objects passed to this function to the first argument
  * of the function, e.g.
  *
  * var result = withDefaults(a, {foo: bar});
  *
  * will return a, with `a.foo` equal to `bar` *if and only if* `a.foo` was
  * undefined.
  */
  withDefaults: function () {
    var a = typeof arguments[0] === 'undefined' ? {} : arguments[0];
    for (var i = 1; i < arguments.length; i++) {
      var defaults = arguments[i];
      for (var prop in defaults) {
        if (defaults.hasOwnProperty(prop) && !a.hasOwnProperty(prop)) {
          a[prop] = defaults[prop];
        }
      }
    }
    return a;
  },
  freq2Rad: function (f) {
    return 2.0 * Math.PI * f;
  },
  rad2Freq: function (w) {
    return w / (2.0 * Math.PI);
  },
  /**
  * Call `x` and return the result if it's a function, otherwise just return `x`.
  */
  get: function (x) {
    return typeof x === 'function' ? x() : x;
  }
};

/**
* ////////////////////////////////////////////////
* Doppler Math
* ////////////////////////////////////////////////
*/
var DMath = {
  c: 340.29,
  observedFrequency: function (relSourceVelocity, sourceFreq) {
    // inverting relSourceVelocity because we're assuming listener's velocity is 0
    return (1 + relSourceVelocity / DMath.c) * sourceFreq;
  },

  /**
   * Returns the source's velocity with respect to the listener
   */
  relativeHorizontalVelocity: function (source, horizVelocity, listener) {
    // if the listener is the reference, moving towards it is postive and
    // away is negative
    var directionModifier = source.x < listener.x ? 1.0 : -1.0,
        opposite = abs(source.y - listener.y),
        adjacent = abs(source.x - listener.x);
    if (adjacent === 0) {
      // angle between listener line of sight & source velocity is 90 deg, whose cos is 0
      return 0;
    }
    return horizVelocity * directionModifier * cos(atan(opposite / adjacent));
  }
};

/**
* ////////////////////////////////////////////////
* Class defs
* ////////////////////////////////////////////////
*/

var Drawable = function (props) {
  this.init(DUtils.withDefaults(props || {}, {x: 0, y: 0}));
};
Drawable.prototype = {
  init: function (props) {
    this.x = props.x;
    this.y = props.y;
  },
  draw: function () {
    // abstract
  },
  pvector: function () {
    return new PVector(this.x, this.y);
  }
};

var ImageView = function (props) {
  Drawable.call(
    this,
    DUtils.withDefaults(
      props,
      {
        width: props.image.width,
        height: props.image.height
      }));
};

ImageView.prototype = DUtils.withDefaults({
init: function (props) {
  Drawable.prototype.init.call(this, props);
  this.width = props.width;
  this.height = props.height;
  this.image = props.image;
},
draw: function() {
  image(this.image, this.x, this.y, this.width, this.height);
}
}, Drawable.prototype);

var Tone = function (props) {
this.init(DUtils.withDefaults(props || {}, {
  generator: sin
}));
};
Tone.prototype = {
init: function(props) {
  if (props.hasOwnProperty("freq")) {
    this.setFrequency(props.freq);
  } else {
    this.radians = props.radians;
  }
  this.amp = props.amp;
  this.generator = props.generator;
},
getFrequency: function () {
  return DUtils.rad2Freq(this.getRadians());
},
setFrequency: function (f) {
  this.radians = function () {
    return DUtils.freq2Rad(DUtils.get(f));
  };
},
getRadians: function () {
  return DUtils.get(this.radians);
},
setRadians: function (w) {
  this.radians = w;
},
value: function (t) {
  return this.amp * this.generator(this.getRadians() * t);
}
};

var WaveformView = function (props) {
Drawable.call(this, DUtils.withDefaults(props, {
  width: width
}));
};
WaveformView.prototype = DUtils.withDefaults({
init: function (props) {
  Drawable.prototype.init.call(this, props);
  this.width = props.width;
  this.tone = props.tone;
},
draw: function (frame) {
  beginShape();
  for (var x = 0; x < this.width; x += 2) {
    curveVertex(
      x + this.x,
      this.y + this.tone.value(x + frame));
    }
    endShape();
  }
}, Drawable.prototype);

var HorizontalMovementAnimator = function (props) {
  this.init(DUtils.withDefaults(props, {
    velocity: 2,
    loop: true
  }));
};
HorizontalMovementAnimator.prototype = {
  init: function(props) {
    this.drawable = props.drawable;
    this.velocity = props.velocity;
    this.from = props.from;
    this.to = props.to;
    this.loop = props.loop;
  },
  draw: function() {
    if (this.loop === true && this.drawable.x > this.to) {
      this.drawable.x = this.from;
      if (typeof this.onLoop === 'function') {
        this.onLoop(this);
      }
    }
    this.drawable.draw();
    this.drawable.x += this.velocity;
  }
};

var Graph = function (props) {
  Drawable.call(this, DUtils.withDefaults(props, {
      points: [],
      width: width,
      height: height
  }));
};
Graph.prototype = DUtils.withDefaults({
    init: function (props) {
        Drawable.prototype.init.call(this, props);
        this.points = props.points;
        this.width = props.width;
        this.height = props.height;
    },
    denormalized: function (p) {
      return {
        x: this.x + this.width / 2 + this.width / 2 * p.x,
        y: this.y + this.height / 2 - this.height / 2 * p.y
      };
    },
    draw: function () {
        for (var i in this.points) {
            var normalizedP = this.points[i];
            var p = this.denormalized(normalizedP);
            point(p.x, p.y);
        }
    },
    addPoint: function (x, y) {
        this.points.push(new PVector(x, y));
    }
}, Drawable.prototype);

/**
* ////////////////////////////////////////////////
* Canvas elements
* ////////////////////////////////////////////////
*/

var createElements = function (exports) {
  exports = exports || {};

  var listenerImage = getImage("space/girl3");
  var listener = new ImageView({
    image: listenerImage,
    x: width / 2,
    y: height / 2
  });
  exports.listener = listener;

  var srcImage = getImage("space/rocketship");
  var src = new ImageView({
    image: srcImage,
    x: srcImage.width / -2,
    y: height - srcImage.height / 2
  });
  exports.src = src;

  var srcMover = new HorizontalMovementAnimator({
    from: src.width / - 2,
    to: (width + src.width / 2),
    drawable: src,
    velocity: 10
  });
  exports.srcMover = srcMover;

  var srcTone = new Tone({
    freq: 3,
    amp: 20
  });
  exports.srcTone = srcTone;

  var listenerTone = new Tone({
    generator: srcTone.generator,
    amp: srcTone.amp,

    /**
     * The frequency (in radians) of the tone from the listener's perspective is a function
     * of the relative velocity of the source.  Increasing as the source approaches, then
     * decreasing as it moves away.
     */
    radians: function () {
      // scaling up the velocity here to exaggerate doppler effect w/o having the image move across the screen too quickly
      var sourceVelocityMulitplier = 30;
      return DUtils.freq2Rad(
        DMath.observedFrequency(
          DMath.relativeHorizontalVelocity(src.pvector(), sourceVelocityMulitplier * srcMover.velocity, listener.pvector()),
          srcTone.getFrequency()));
    }
  });
  exports.listenerTone = listenerTone;

  var srcToneWaveformView = new WaveformView({
    tone: srcTone,
    x: 0,
    y: srcTone.amp + 10
  });
  exports.srcToneWaveformView = srcToneWaveformView;

  var listenerToneWaveformView = new WaveformView({
    tone: listenerTone,
    x: 0,
    y: srcToneWaveformView.y + srcTone.amp + 40 + listenerTone.amp
  });
  exports.listenerToneWaveformView = listenerToneWaveformView;

  var freqGraph = new Graph();
  exports.freqGraph = freqGraph;

  // prevent freqGraph from infinitely accumulating points
  srcMover.onLoop = function (animator) {
    freqGraph.points = [];
  };

  return exports;
};

// TODO: expose slider for velocity
// TODO: add "step" button/functionality
// TODO: show source and perceived frequency
// TODO: add labels for waveforms

/**
* ////////////////////////////////////////////////
* Render callback
* ////////////////////////////////////////////////
*/
var elements;
var draw = function() {
  if (!elements) {
    elements = createElements();
  }
  noFill();
  background(255, 255, 255);
  strokeWeight(1);
  stroke(0,0,0);
  imageMode(CENTER);

  // passing `0` to prevent waveforms from animation, which makes it easier to see the change in observed frequency
  elements.srcToneWaveformView.draw(0);
  elements.listenerToneWaveformView.draw(0);
  elements.listener.draw();
  elements.srcMover.draw();

  stroke(230, 115, 115);
  strokeWeight(3);
  var src = elements.src,
      listener = elements.listener,
      srcTone = elements.srcTone,
      listenerTone = elements.listenerTone;

  var srcProgress = src.x / width - 0.5;
  var freqRatio = (listenerTone.getFrequency() - srcTone.getFrequency()) / 10;

  elements.freqGraph.addPoint(srcProgress, freqRatio);
  elements.freqGraph.draw();
};
