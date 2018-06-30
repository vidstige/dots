const shape = require('./programs/shape.js');

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

function start(animations) { 
  const canvas = document.getElementById("target");
  const ctx = canvas.getContext("2d");

  function animate(t) {
    console.log(animations);
    const dots = animations[0].dots;
    ctx.resetTransform();
    ctx.translate(canvas.width / 2, canvas.height/2);
    ctx.scale(512, 512);
    ctx.translate(-0.5, -0.5);
    for (var i = 0; i < dots.length; i++) {
      const dot = dots[i];
      ctx.fillStyle = dot.color || "#000000";
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, 2 * Math.PI);
      ctx.fill();
    }
    //requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

const animations = [
  shape,
];

function ready() {
  const canvas = document.getElementById("target");
  const ctx = canvas.getContext("2d");

  fitToContainer(canvas);

  const loaders = animations.map(p => p.load(canvas, ctx, palette));
  Promise.all(loaders).then(start);
}

document.addEventListener('DOMContentLoaded', ready, false);
