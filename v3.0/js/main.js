"use strict";

import Game from "./Game.js"
import ResourceLoader from "./ResourceLoader.js"
import Resource from "./Resource.js"
import c from "./const.js"

const cnv = document.querySelector("#game");
const ctx = cnv.getContext("2d");

cnv.width = c.gameWidth;
cnv.height = c.gameHeight;

const res = new ResourceLoader();
res.load([
  new Resource("live", "sprites/live.png", "image"),
  new Resource("death", "sprites/death.png", "image"),
  new Resource("hero", "sprites/lama-spritesheet.png", "image"),
  new Resource("enemy", "sprites/bee-spritesheet.png", "image"),
  new Resource("bonus", "sprites/bonus-spritesheet.png", "image"),
  new Resource("weapon", "sprites/weapon-spritesheet.png", "image"),
  new Resource("background", "sprites/bg.png", "image"),
  new Resource("sound_background", "sound-effects/bg-bit.mp3", "sound"),
  // new Resource("sound_shootHero", "sound-effects/eeea.mp3", "sound"),
  new Resource("sound_shootHero", "sound-effects/raaa.mp3", "sound"),
  // new Resource("sound_shootEnemy", "sound-effects/vaaa.mp3", "sound")
  new Resource("sound_shootEnemy", "sound-effects/eeea.mp3", "sound")
]);

let game;
let lastTime = 0;

loading();

res.onLoad(start);

function start() {
  game = new Game(cnv, res);

  game.start();

  requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
  const deltaTime = (timeStamp - lastTime) / 1000;
  lastTime = timeStamp;

  game.update(deltaTime);
  game.draw(ctx);

  requestAnimationFrame(gameLoop);
}

function loading() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  ctx.fillStyle = "white";
  ctx.font = "50px Arial";
  ctx.textAlign = "center";
  ctx.fillText("LOADING...", cnv.width / 2, cnv.height / 2);
}
