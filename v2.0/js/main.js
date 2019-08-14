"use strict";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

setInterval(update, 1000/60);


const hw = 32,
      hh = hw;
let hx = canvas.width / 2 ^ 0,
    hy = canvas.height - hh,
    hxv = 0,
    hyv = 0,
    goLeft = false,
    goRight = false,
    platforms = [];

update();

function update() {

  hxv = goLeft ? -2 : goRight ? 2 : 0;

  hx += hxv;
  hy += hyv;

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "red";
  context.fillRect(hx, hy, hw, hh);
}


function keyDown(event) {
  switch (event.code) {
    case "ArrowLeft":
      goLeft = true;
      break;
    case "ArrowRight":
      goRight = true;
      break;
  }
}

function keyUp(event) {
  switch (event.code) {
    case "ArrowLeft":
      goLeft = false;
      break;
    case "ArrowRight":
      goRight = false;
      break;
  }
}

