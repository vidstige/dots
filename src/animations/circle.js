function Circle(canvas, ctx, palette) {
  // Can do any number of dots, but cannot change count!
  this.from = function(to) { return to; }
  this.to = function(from) { return from; }
  const av = 1000;
  this.dots = function(t, n) {
    var dots = [];
    for (var i = 0; i < n; i++) {
      const a = 2*Math.PI * i / n;
      dots.push({
        x: 0.5 + Math.cos(a + t / av) * 0.5,
        y: 0.5 + Math.sin(a + t / av) * 0.5,
        r: 0.01});
    }
    return dots;
  };
}

function load() {
  return new Circle(...arguments);
}
module.exports = {load};
