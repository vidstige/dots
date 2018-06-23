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

// Fits dots to the particles
function fit(img) {
  function alpha(x, y) {
    return img.data[(x + y*img.width) * 4];
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

  const n = particles.length;
  var dists = Array(n);  // holds distances to all other particles
  var limits = Array(n); // holds min distance to any edge
  for (var i = 0; i < n; i++) {
    dists[i] = Array(n);
    for (var j = 0; j < n; j++) {
      dists[i][j] = dist2(particles[i], particles[j]);
    }

    const edges_distances = edges.map(function(e) { return dist2(e, particles[i]); });
    limits[i] = Math.min(...edges_distances);
  }
}

function start(heartImage, volumentalImage) {
  const canvas = document.getElementById("target");
  const ctx = canvas.getContext("2d");

  const heart = getImageData(ctx, heartImage);
  const volumental = getImageData(ctx, volumentalImage);

  const first = fit(volumental);
  console.log(first);
}

function main() {
  const images = [
    'static/heart.png', 'static/volumental.png'];
  var done = [];
  for (var i = 0; i < images.length; i++) {
      const img = new Image();
      img.onload = function() {
          done.push(this);
          if (done.length == images.length) {
              console.log("all loaded");
              start.apply(null, done);
          }
      };
      img.src = images[i];
  }

}

document.addEventListener('DOMContentLoaded', main, false);
