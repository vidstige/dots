const Wave = require('../offsets/wave.js').Wave;

function Grid(canvas, ctx, palette) {
  // Can do any number of dots, but cannot change count!
  this.from = function(to) { return to; }
  this.to = function(from) { return from; }
  this.dots = function(t, n) {
    const side = Math.ceil(Math.sqrt(n));
    var dots = [];
    for (var i = 0; i < n; i++) {
      dots.push({
        x: (i % side) / side,
        y: Math.floor(i / side) / side,
        r: 0.05});
    }
    return dots;
  };
}

function load() {
  return new Wave(new Grid(...arguments), 0.80, 80, 0.02);
}
module.exports = {load};
