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
      gravity = 0.4,
      hw = 32,
      hh = hw;
let hx = canvas.width / 2 ^ 0,
    hy = canvas.height - hh - 10,
    hxv = 0,
    hyv = 0,
    goLeft = false,
    goRight = false,
    jump = false,
    platforms = [];


init();
const gameLoop = setInterval(update, 1000/50);


function init() {

  platforms = [
    {
      x: -2000,
      y: canvas.height,
      w: canvas.width + 4000,
      h: 50
    }
  ];

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
  if ((hy + hh) <= 0) {
    win();
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


  // Проверка коллизий
  let wasCollide = false;
  for (let i = 0; i < platforms.length; i++) {
    const collide = isCollide(hx + hxv, hy + hyv, hw, hh, platforms[i]);

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
        break;
    }
  }

  hx += hxv;
  hy = wasCollide ? hy : (hy + hyv);

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

// function isCollide(nextHx, nextHy, hw, hh, p) {
//   const nextHCentreX = nextHx + hw / 2;
//   const nextHCentreY = nextHy + hh / 2;
//
//   const hCentreX = hx + hw / 2;
//   const hCentreY = hy + hh / 2;
//
//   const pCentreX = p.x + p.w / 2;
//   const pCentreY = p.y + p.h / 2;
//
//   // Определить под каким углом
//
//   const tan = (nextHCentreY - pCentreY) / (nextHCentreX - pCentreX);
//
//   console.log(tan)
//
// }

// function isCollide(hx, hy, hw, hh, p) {
//   const hLeftBtwP = (hx < (p.x + p.w)) && (hx > p.x);
//   const hRightBtwP = ((hx + hw) > p.x) && ((hx + hw) < (p.x + p.w));
//   const hTopBtwP = (hy < (p.y + p.h)) && (hy > p.y);
//   const hBottomBtwP = ((hy + hh) > p.y) && ((hy + hh) < (p.y + p.h));
// }

// function isCollide(hx, hy, hw, hh, p) {
//   if ((hx + hw) <= p.x ||
//       hy >= (p.y + p.h) ||
//       hx >= (p.x + p.w) ||
//       (hy + hh) <= p.y) {
//     return "none";
//   }
//
//   if ( ((hy + hh) > p.y) && ((hy + hh) < (p.y + p.h)) ) {
//     return "bottom";
//   }
//
//   if ( (hx < (p.x + p.w)) && (hx > p.x) &&
//       (((hy > p.y) && (hy < (p.y + p.h))) ||
//           (((hy + hh) > p.y) && ((hy + hh) < (p.y + p.h))) ||
//           ((hy > p.y) && ((hy + hh) < (p.y + p.h))) ||
//           ((hy < p.y) && ((hy + hh) > (p.y + p.h))) )) {
//     return "left";
//
//   }
//   if ( ((hx + hw) > p.x) && ((hx + hw) < (p.x + p.w)) ) {
//     return "right";
//
//   }
//
//   if ( (hy < (p.y + p.h)) && (hy > p.y) ) {
//     return "top";
//   }
// }

// function isCollide(hx, hy, hw, hh, p) {
//   let dx=(hx+hw/2)-(p.x+p.w/2);
//   let dy=(hy+hh/2)-(p.y+p.h/2);
//   let width=(hw+p.w)/2;
//   let height=(hh+p.h)/2;
//   let crossWidth=width*dy;
//   let crossHeight=height*dx;
//   let collision='none';
//
//   if(Math.abs(dx) <= width && Math.abs(dy) <= height) {
//     if(crossWidth > crossHeight) {
//       collision= (crossWidth > -crossHeight) ? 'top' : 'left';
//     } else {
//       collision= (crossWidth > -crossHeight) ? 'right' : 'bottom';
//     }
//   }
//   return collision;
// }


// Вертикальный отскок от поверхностей
function rebound(px, py) {
  if ((hy + hh) >= py) {
    if (jump) {
      hyv = -jumpForce;

    } else if (hyv && ((hyv - (hyv * bound)) > 1)) {
      hyv = -hyv * bound;

    } else {
      // hy = py - hh;
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
