function One(canvas, ctx, palette) {
  this.dots = [];
  for (var i = 0; i < palette.length; i++) {
    this.dots.push(
      {x: 1  * (i / palette.length), y: 0.5,
       r: 0.05, color: palette[i]}
    );
  }
}

function load() {
  return new One(...arguments);
}
module.exports = {load};
