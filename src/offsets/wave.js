function Wave(inner, wl, av, a) {
  this.from = inner.from;
  this.to = inner.to;
  this.dots = function(t, n) {
    const dots = inner.dots(t, n);
    for (var i = 0; i < dots.length; i++) {
      dot = dots[i];
      dot.y += Math.sin(2*Math.PI * dot.x / wl + t / av) * a;
    }
    return dots;
  };
}

module.exports = {Wave};
