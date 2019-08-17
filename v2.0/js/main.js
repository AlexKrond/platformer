"use strict";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");

canvas.width = document.documentElement.clientWidth - 20;
canvas.height = document.documentElement.clientHeight - 70;

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

const platformsNum = 40,
      crashFrequency = 1,
      acceleration = 0.1,
      maxSpeed = 7,
      startSpeed = 2,
      jumpForce = 15,
      bound = 0.78,
      gravity = 0.4,
      hw = 32,
      hh = hw;
let hx = canvas.width / 2 - hw / 2,
    hy = canvas.height - hh - 100,
    hxv = 0,
    hyv = 0,
    goLeft = false,
    goRight = false,
    jump = false,
    platforms = [],
    bonus = [],
    bonusScore = 0,
    frameScore = 0,
    frames = 0;
let lastCrash = 0,
    crashedPlatforms = [];

init();
const gameLoop = setInterval(update, 1000/50);


function init() {

  platforms = [
    {
      x: canvas.width / 2 - 100,
      y: canvas.height - 100,
      w: 200,
      h: 30
    }
  ];

  for (let i = 0; i < platformsNum; i++) {
    platforms.push({
      x: Math.random()*canvas.width - 100,
      y: Math.random()*canvas.height - 200,
      w: Math.random()*150 + 100,
      h: Math.random()*15 + 15
    })
  }

  bonus = [
    {
      x: canvas.width / 2 - 90,
      y: canvas.height - 100 - hh,
      w: hw,
      h: hh
    }
  ];
}

function update() {

  // Отрисовка игровых элементов
  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  for (let i = 0; i < platforms.length; i++) {
    context.fillRect(platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h);
  }

  context.fillStyle = "gold";
  for (let i = 0; i < bonus.length; i++) {
    context.fillRect(bonus[i].x, bonus[i].y, bonus[i].w, bonus[i].h);
  }

  for (let i = 0; i < crashedPlatforms.length; i++) {
    crashedPlatforms[i].draw();
  }

  context.fillStyle = "red";
  context.fillRect(hx, hy, hw, hh);

  context.fillStyle = "red";
  context.font = "20px Arial";
  context.fillText(`Score: ${frameScore + bonusScore}`, 10, 25);


  // WIN!!!
  // if ((hy + hh) <= 0) {
  //   win();
  // }

  // LOSE(
  if (hy > canvas.height) {
    lose();
  }


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


  // Проверка коллизий с платформами
  let wasCollide = false;
  for (let i = 0; i < platforms.length; i++) {
    const collide = isCollide(hx + hxv, hy + hyv + 0.5, hw, hh, platforms[i]);
    // if (collide !== "none")console.log(collide);
    switch (collide) {
      case "none":
        break;

      case "side":
        hxv = -hxv * 0.5;
        break;

      case "top":
        wasCollide = true;
        hy = platforms[i].y + platforms[i].h;
        hyv = 0;
        break;

      case "bottom":
        wasCollide = true;
        hy = platforms[i].y - hh;
        rebound(platforms[i].x, platforms[i].y);

        // Разлом платформы
        if (Math.random() < crashFrequency && lastCrash !== i) {
          if (lastCrash !== 0) crashPlatform(i);
          lastCrash = i;
        }

        break;
    }
  }


  // Проверка коллизий с бонусами
  for (let i = 0; i < bonus.length; i++) {
    const collide = isCollide(hx + hxv, hy + hyv, hw, hh, bonus[i]);
    if (collide !== "none") {
      bonus.splice(i, 1);
      bonusScore += 100;
    }
  }


  hx += hxv;
  hy = wasCollide ? hy : (hy + hyv);

  frameScore = frames++ / 10 ^ 0;
  drop();
  if (frames % 300 === 0) spawnPlatforms();
}


function drop() {
  for (let i = 0; i < platforms.length; i++) {
    if (platforms[i]) {
      platforms[i].y += 0.5;

      if (platforms[i].y > (canvas.height + hh)) {
        platforms.splice(i, 1);
      }
    }
  }

  for (let i = 0; i < bonus.length; i++) {
    if (bonus[i]) {
      bonus[i].y += 0.5;

      if (bonus[i].y > canvas.height) {
        bonus.splice(i, 1);
      }
    }
  }

  for (let i = 0; i < crashedPlatforms.length; i++) {
    if (crashedPlatforms[i]) {
      crashedPlatforms[i].y += 5;

      if (crashedPlatforms[i].y > canvas.height) {
        crashedPlatforms.splice(i, 1);
      }
    }
  }
}

function spawnPlatforms() {
  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: Math.random() * canvas.width - 100,
      y: Math.random() * -300,
      w: Math.random()*150 + 100,
      h: Math.random()*15 + 15
    })
  }

  const lastP = platforms.length - 1;
  bonus.push({
      x: platforms[lastP].x + platforms[lastP].w / 2 - hw / 2,
      y: platforms[lastP].y - hh,
      w: hw,
      h: hh
  });
}

function crashPlatform(i) {
  crashedPlatforms.push(new crashedPlatform(platforms[i].x, platforms[i].y, platforms[i].w, platforms[i].h));
  platforms[i].y = canvas.height + hh + 10;
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


// Если проиграл
function lose() {
  clearInterval(gameLoop);

  const  score = frameScore + bonusScore;

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "white";
  context.font = "100px Arial";
  context.fillText("LOSE :(", canvas.width / 2 - 200, canvas.height / 2);
  context.fillText(`Your score: ${score}`, canvas.width / 2 - 320, canvas.height / 2 + 200);

  const highScore = localStorage.highscore || 0;
  if (score > highScore) {
    localStorage.setItem("highscore", score);
  }

  context.font = "50px Arial";
  context.fillText(`Highscore: ${localStorage.highscore}`, canvas.width / 2 - 180, canvas.height / 2 - 200);
}

// Проверка коллизии
function isCollide(nextHx, nextHy, hw, hh, p) {
  if ((nextHx + hw) <= p.x ||
      nextHy >= (p.y + p.h) ||
      nextHx >= (p.x + p.w) ||
      (nextHy + hh) <= p.y) {
    return "none";
  }

  if ((hy + hh) <= p.y) {
    return "bottom";
  }

  if (hy >= (p.y + p.h)) {
    return "top";
  }

  return "side";
}


// Вертикальный отскок от поверхностей
function rebound(px, py) {
  if ((hy + hh) >= py) {
    if (jump) {
      hyv = -jumpForce; // TODO: Добавить проверку на текущий hyv

    } else if (hyv && ((hyv - (hyv * bound)) > 1)) {
      hyv = -hyv * bound;

    } else {
      hyv = 0;
    }
  }
}


// Нажатие клавиши
function keyDown(event) {
  switch (event.code) {
    case "KeyA":
    case "ArrowLeft":
      goLeft = true;
      goRight = false;
      break;
    case "KeyD":
    case "ArrowRight":
      goRight = true;
      goLeft = false;
      break;
  }
  if (event.code === "KeyW" || event.code === "ArrowUp") {
    jump = true;
  }
}


// Отпускание клавиши
function keyUp(event) {
  switch (event.code) {
    case "KeyA":
    case "ArrowLeft":
      goLeft = false;
      break;
    case "KeyD":
    case "ArrowRight":
      goRight = false;
      break;
    case "KeyW":
    case "ArrowUp":
      jump = false;
      break;
  }
}

class crashedPlatform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw() {
    const angle = 35;
    // context.fillStyle = "lightslategray";
    // context.fillStyle = "lightgray";
    context.fillStyle = "gray";

    context.save();
    context.translate(this.x, this.y);

    context.rotate(angle * Math.PI / 180);

    context.fillRect(0, 0, this.w / 2, this.h);

    context.restore();
    context.save();
    context.translate(this.x + this.w, this.y);

    context.rotate((90 - angle) * Math.PI / 180);
    context.fillRect(0, 0, this.h, this.w / 2);

    context.restore();
  }
}
