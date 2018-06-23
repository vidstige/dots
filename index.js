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
function fitDot(img) {
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
    r: Math.floor(Math.sqrt(limits[index]))
  };

  // 4. Erase particles
  const padding = 2;
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
  for (var i = 0; i < 20; i++) {
    const dot = fitDot(img);
    if (dot == null) break;
    if (dot.r < 2) break;
    dots.push(dot);
  }
  return dots;
}

function start(heartImage, volumentalImage) {
  const canvas = document.getElementById("target");
  const ctx = canvas.getContext("2d");

  const heart = getImageData(ctx, heartImage);
  const volumental = getImageData(ctx, volumentalImage);

  const dots = fitDots(volumental);
  //const dots = fitDots(heart);
  
  function animate(t) {
    ctx.fillStyle = "#000000";
    for (var i = 0; i < dots.length; i++) {
      const dot = dots[i];
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
      ctx.fill();
    }
    //requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
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
