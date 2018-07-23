function One(canvas, ctx, palette) {
  var _createDots = function(n) {
    var dots = [];
    for (var i = 0; i < n; i++) {
      dots.push({x: Math.floor(palette.length * i / n) / palette.length, y: 0.5, r: 0.05});
    }
    return dots;
  }
  this._cache = {};
  // Any - Can change count!
  this.from = function() { return null };
  this.to = function() { return null; }
  this.dots = function(t, n) {
    if (!(n in this._cache)) {
      this._cache[n] = _createDots(n);
    }
    return this._cache[n];
  };
}

function load() {
  return new One(...arguments);
}
module.exports = {load};
