function getParticles(ctx, image) {
  // Get image data
  ctx.drawImage(image, 0, 0);
  const img = ctx.getImageData(0, 0, image.width, image.height);
  ctx.clearRect(0, 0, image.width, image.height);

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

function start(heartImage, volumentalImage) {
  const canvas = document.getElementById("target");
  const ctx = canvas.getContext("2d");

  const heart = getParticles(ctx, heartImage);
  const volumental = getParticles(ctx, volumentalImage);
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
