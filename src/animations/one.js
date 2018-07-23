function One(canvas, ctx, palette) {
  this._createDots = function(n) {
    console.log(n);
    var dots = [];
    for (var i = 0; i < n; i++) {
      dots.push({x: Math.floor(palette.length * i / n) / palette.length, y: 0.5, r: 0.05});
    }
    return dots;
  }
  this.from = function() {
    return null;
  };
  this.to = function() {
    return null;
  }
  this.dots = function(t, from, to) {
    if (t < 0.5) {
      if (!this.left) {
        this.left = this._createDots(palette.length * 2);
      }
      return this.left;
    }
    if (!this.right) {
      this.right = this._createDots(palette.length * 2);
    }
    return this.right;
  };
}

function load() {
  return new One(...arguments);
}
module.exports = {load};
