"use strict";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

const platformsNum = 20,
      acceleration = 0.1,
      maxSpeed = 7,
      startSpeed = 2,
      jumpForce = 8,
      bound = 0.78,
      gravity = 0.3,
      hw = 32,
      hh = hw;
let hx = canvas.width / 2 ^ 0,
    hy = canvas.height - hh,
    hxv = 0,
    hyv = 0,
    goLeft = false,
    goRight = false,
    jump = false,
    platforms = [
      {
        x: -2000,
        y: canvas.height,
        w: canvas.width + 4000,
        h: 50
      }
    ];


init();
const gameLoop = setInterval(update, 1000/50);


function init() {

  for (let i = 0; i < platformsNum; i++) {
    platforms.push({
      x: Math.random()*canvas.width - 100,
      y: Math.random()*canvas.height,
      w: Math.random()*150 + 100,
      h: Math.random()*15 + 15
    })
  }

}

function update() {

  // Отрисовка игровых элементов
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  for (let i = 0; i < platforms.length; i++) {
    context.fillRect(platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h);
  }

  context.fillStyle = "red";
  context.fillRect(hx, hy, hw, hh);


  // WIN!!!
  // if (hy <= 0) {
  //   win();
  // }


  // Движение с ускорением и остановкой
  switch (true) {
    case goLeft:
      if (hxv <= 0) {
        hxv = hxv ? (hxv < -maxSpeed) ? hxv : (hxv - acceleration) : -startSpeed;
      } else {
        hxv = (hxv < 0.5 && hxv > -0.5) ? 0 : hxv + (-hxv * 0.1);
      }
      break;
    case goRight:
      if (hxv >= 0) {
        hxv = hxv ? (hxv > maxSpeed) ? hxv : (hxv + acceleration) : startSpeed;
      } else {
        hxv = (hxv < 0.5 && hxv > -0.5) ? 0 : hxv + (-hxv * 0.1);
      }
      break;
    default:
      hxv = (hxv < 0.5 && hxv > -0.5) ? 0 : hxv + (-hxv * 0.1);
  }


  // Ускорение при падении
  hyv = hyv ? (hyv + gravity) : gravity;


  // Проверка коллизий
  let collide = false;
  for (let i = 0; i < platforms.length; i++) {
    if (isCollide(hx + hxv, hy + hyv, hw, hh, platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h)) {
      hy = platforms[i].y - hh;
      collide = true;
      rebound(platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h);
    }
  }

  hx += hxv;
  hy = collide ? hy : (hy + hyv);
}


// Если выиграл
function win() {
  clearInterval(gameLoop);

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  context.font = "100px Arial";
  context.fillText("WIN!", canvas.width / 2 - 100, canvas.height / 2);
}


// Проверка коллизии
function isCollide(hx, hy, hw, hh, px, py, pw, ph) {
  return !((hx + hw) < px ||
          hy > (py + ph) ||
          hx > (px + pw) ||
          (hy + hh) < py);
}


// Вертикальный отскок от поверхностей
function rebound(px, py, pw, ph) {
  if ((hy + hh) >= py) {
    if (jump) {
      hyv = -jumpForce;

    } else if (hyv && ((hyv - (hyv * bound)) > 1)) {
      hyv = -hyv * bound;

    } else {
      hy = py - hh;
      hyv = 0;
    }
  }
}


// Нажатие клавиши
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
  if (event.code === "ArrowUp") {
    jump = true;
  }
}


// Отпускание клавиши
function keyUp(event) {
  switch (event.code) {
    case "ArrowLeft":
      goLeft = false;
      break;
    case "ArrowRight":
      goRight = false;
      break;
    case "ArrowUp":
      jump = false;
      break;
  }
}
