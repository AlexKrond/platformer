"use strict";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

const platformsNum = 20,
      jumpForce = -8,
      gravity = 0.3,
      hw = 32,
      hh = hw;
let hx = canvas.width / 2 ^ 0,
    hy = canvas.height - hh,
    hxv = 0,
    hyv = 0,
    goLeft = false,
    goRight = false,
    platforms = [];


init();
setInterval(update, 1000/60);


function init() {

  for (let i = 0; i < platformsNum; i++) {
    platforms[i] = {
      x: Math.random()*canvas.width - 100,
      y: Math.random()*canvas.height,
      w: Math.random()*150 + 100,
      h: Math.random()*15 + 15
    };
  }

}

function update() {

  // Движение без ускорения
  // hxv = goLeft ? -2 : goRight ? 2 : 0;

  // Движение с ускорением
  switch (true) {
    case goLeft:
      hxv = hxv ?  (hxv * 1.01) : -2;
      break;
    case goRight:
      hxv = hxv ? (hxv * 1.01) : 2;
      break;
    default:
      hxv = 0;
  }

  //
  // Движение с ускорение и замедлением будет
  //

  hyv = hyv ? (hyv + gravity) : 0;


  hx += hxv;
  hy += hyv;

  if (hy >= (canvas.height - hh)) {
    hy = canvas.height - hh;
    hyv = 0;
  }

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  for (let i = 0; i < platformsNum; i++) {
    context.fillRect(platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h);
  }

  context.fillStyle = "red";
  context.fillRect(hx, hy, hw, hh);
}

// TODO: Исправить баг при одновременном нажатии клавиш (вверх + право/лево + лево/право [право/лево отпускаем])

function keyDown(event) {
  switch (event.code) {
    case "ArrowLeft":
      goLeft = true;
      goRight = false;
      break;
    case "ArrowRight":
      goRight = true;
      goLeft = false;
      break;
  }
  if (event.code === "ArrowUp" && hyv === 0) {
    hyv = jumpForce;
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

