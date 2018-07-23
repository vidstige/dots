const one = require('./animations/one.js');
const shape = require('./animations/shape.js');
const circle = require('./animations/circle.js');
const grid = require('./animations/grid.js');

// http://www.colourlovers.com/palette/725298/Strawberry_Mousse
const palette = [
  "#A79C8E",
  "#F8ECC9",
  "#F1BBBA",
  "#EB9F9F",
  "#6B5344"
];

// fits canvas element to its parent
function fitToContainer(canvas){
  canvas.width = document.body.clientWidth - 20;
  canvas.height = document.body.clientHeight - 20;
}

function clear(canvas, ctx) {
  ctx.save();
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Restore the transform
  ctx.restore();
}

function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}
function lerp_dots(d1, d2, t) {
  const tmp = [];
  for (var i = 0; i < d1.length; i++) {
    tmp.push({
      x: lerp(d1[i].x, d2[i].x, t),
      y: lerp(d1[i].y, d2[i].y, t),
      r: lerp(d1[i].r, d2[i].r, t),
      });
  }
  return tmp;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// returns dot array - blends animations during transitions
function Planner(animations) {
  this.cycle = 3 * 1000;
  this.transitionTime = 0.2;
  var count = null;
  this.dots = function(t) {
    const n = Math.floor((t / this.cycle) % animations.length);
    const phase = (t % this.cycle) / this.cycle;

    const current = animations[n];
    const next = animations[(n+1) % animations.length];

    count = current.from(count);
    if (count == null) {
      // Try to get count from next
      count = next.from(null);
      // No preference - go random
      count = getRandomInt(palette.length * 2) + palette.length;
    }
  
    //const need = next.from() == null ? current.to() : next.from();
    const need = count;

    if (phase > 1 - this.transitionTime) {
      const transition_t = (phase - (1 - this.transitionTime)) / this.transitionTime
      return lerp_dots(
        current.dots(t, need),
        next.dots(t, need),
        transition_t
        );
    }
    return current.dots(t, need);
  }
}

function start(planner) { 
  const canvas = document.getElementById("target");
  const ctx = canvas.getContext("2d");

  ctx.resetTransform();
  ctx.translate(canvas.width / 2, canvas.height/2);
  ctx.scale(512, 512);
  ctx.translate(-0.5, -0.5);

  function animate(t) {
    const dots = planner.dots(t);
    clear(canvas, ctx);
    for (var i = 0; i < dots.length; i++) {
      const dot = dots[i];
      const pi = ~~(i * palette.length / dots.length);
      ctx.fillStyle = palette[pi];
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

const animations = [
  //one,
  shape,
  circle,
  grid,
];

function ready() {
  const canvas = document.getElementById("target");
  const ctx = canvas.getContext("2d");

  fitToContainer(canvas);

  const loaders = animations.map(l => l.load(canvas, ctx, palette));
  Promise.all(loaders).then(ls => start(new Planner(ls)));
}

document.addEventListener('DOMContentLoaded', ready, false);
