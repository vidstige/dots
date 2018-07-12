
function maxIndex(a) {
  var max = a[0];
  var index = 0;
  for (var i = 1; i < a.length; i++) {
      if (a[i] > max) {
          index = i;
          max = a[i];
      }
  }
  return index;
}

function getImageData(ctx, image) {
  // Get image data
  ctx.drawImage(image, 0, 0);
  const img = ctx.getImageData(0, 0, image.width, image.height);
  ctx.clearRect(0, 0, image.width, image.height);
  return img;
}

function getParticles(ctx, image) {
  const img = getImageData(ctx, image);

  // Convert to coordinates
  const particles = [];
  var c = 0;
  for (var y = 0; y < img.height; y++) {
      for (var x = 0; x < img.width; x++) {
          var r = img.data[c++];
          var g = img.data[c++];
          var b = img.data[c++];
          var a = img.data[c++];
          if (a > 0) {
              particles.push({x: x, y: y, a: a});
          }
      }
  }
  return particles;
}

function dist2(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return dx*dx + dy*dy;
}
function inside(p, dot) {
  return dist2(p, dot) < dot.r * dot.r;
}

// counts particles inside dot
function count(particles, dot) {
  var c = 0;
  for (var i = 0; i < particles.length; i++) {
    if (inside(particles[i], dot)) c++;
  }
  return c;
}

// Fits a single dot to the image
function fitDot(img, padding, cap) {
  function alpha(x, y) {
    return img.data[(x + y*img.width) * 4 + 3];
  }

  // 1. Find all non-transparent points
  //    and the edges around those areas
  var particles = [];
  var edges = [];
  for (var y = 1; y < img.height-1; y++) {
    for (var x = 1; x < img.width-1; x++) {
      if (alpha(x, y) > 0) {
        particles.push({x: x, y: y});
      } else {
        if (alpha(x+1, y) > 0 ||
            alpha(x-1, y) > 0 ||
            alpha(x, y+1) > 0 ||
            alpha(x, y-1) > 0)
          {
            edges.push({x: x, y: y});
          }
      }
    }
  }

  // 2. Compute distances edges
  const n = particles.length;
  if (n == 0) {
    return null;
  }
  var limits = Array(n); // holds min distance to any edge
  for (var i = 0; i < n; i++) {
    const edges_distances = edges.map(function(e) { return dist2(e, particles[i]); });
    limits[i] = Math.min(...edges_distances);
  }

  // 3. Drop circle
  const index = maxIndex(limits);
  
  const dot = {
    x: particles[index].x,
    y: particles[index].y,
    r: Math.min(Math.floor(Math.sqrt(limits[index])), cap)
  };

  // 4. Erase particles
  const r = dot.r + padding;
  const r2 = r*r;
  for (var x = dot.x - r; x < dot.x + r; x++) {
    for (var y = dot.y - r; y < dot.y + r; y++) {
      if (dist2(dot, {x: x, y:y}) < r2) {
        img.data[(x + y*img.width) * 4 + 3] = 0;
      }
    }
  }
  
  return dot;
}

function fitDots(img) {
  var dots = [];
  while (true) {
    const dot = fitDot(img, 1, 14);
    if (dot == null) break;
    if (dot.r < 2) break;
    dots.push(dot);
  }
  return dots;
}

function colorize(dots, palette) {
  for (var i = 0; i < dots.length; i++) {
    dots[i].color = palette[Math.floor(i * palette.length / dots.length)];
  }
}

function normalize(dots) {
  const xs = dots.map(function (d) { return d.x; });
  const ys = dots.map(function (d) { return d.y; });
  const x_hi = Math.max(...xs);
  const x_lo = Math.min(...xs);
  const y_hi = Math.max(...ys);
  const y_lo = Math.min(...ys);
  const s = Math.max(x_hi - x_lo, y_hi - y_lo);
  for (var i = 0; i < dots.length; i++) {
    dots[i].x = (dots[i].x - x_lo) / s;
    dots[i].y = (dots[i].y - y_lo) / s;
    dots[i].r = dots[i].r / s;
  }
}

function Shape(ctx, image, palette) {
  const img = getImageData(ctx, image);
  const _dots = fitDots(img);
  _dots.sort(function(a, b) { return a.y - b.y; });
  normalize(_dots);
  colorize(_dots, palette);
  this.dots = function(t) {
    return _dots;
  };
}

function load(canvas, ctx, palette) {
  return new Promise(function(resolve, reject) {
    const images = [
      'static/heart.png', 'static/volumental.png'];
    var done = [];
    for (var i = 0; i < images.length; i++) {
        const img = new Image();
        img.onload = function() {
            done.push(this);
            if (done.length == images.length) {
              console.log("all loaded");
              resolve(new Shape(ctx, done[0], palette));
            }
        };
        img.src = images[i];
    }
  });
}

module.exports = {load};
