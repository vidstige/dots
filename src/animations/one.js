function One(canvas, ctx, palette) {
  var _dots = [];
  for (var i = 0; i < palette.length; i++) {
    _dots.push({x: 1  * (i / palette.length), y: 0.5, r: 0.05});
  }
  this.dots = function(t) {
    return _dots;
  };
}

function load() {
  return new One(...arguments);
}
module.exports = {load};
