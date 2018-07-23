const one = require('./animations/one.js');
const shape = require('./animations/shape.js');

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

// returns dot array - blends animations during transitions
function Planner(animations) {
  this.cycle = 3 * 1000;
  this.dots = function(t) {
    //console.log(t);
    const n = Math.floor((t / this.cycle) % animations.length);
    return animations[n].dots(t);
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
  one,
  shape,
];

function ready() {
  const canvas = document.getElementById("target");
  const ctx = canvas.getContext("2d");

  fitToContainer(canvas);

  const loaders = animations.map(l => l.load(canvas, ctx, palette));
  Promise.all(loaders).then(ls => start(new Planner(ls)));
}

document.addEventListener('DOMContentLoaded', ready, false);
