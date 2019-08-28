"use strict";

import Game from "./Game.js";

const cnv = document.querySelector("#game");
const ctx = cnv.getContext("2d");

const game = new Game();
game.canvas = cnv;

cnv.width = game.width;
cnv.height = game.height;

game.start();

let lastTime = 0;

function gameLoop(timeStamp) {
  const deltaTime = (timeStamp - lastTime) / 1000;
  lastTime = timeStamp;

  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
