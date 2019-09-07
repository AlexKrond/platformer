"use strict";

import Game from "./Game.js";
import ResourceLoader from "./ResourceLoader.js"
import Resource from "./Resource.js"

const cnv = document.querySelector("#game");
const ctx = cnv.getContext("2d");

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
  new Resource("sound_shootHero", "sound-effects/eeea.mp3", "sound"),
  new Resource("sound_shootEnemy", "sound-effects/vaaa.mp3", "sound"),
]);

let game;
let lastTime = 0;

res.onLoad(start);

function start() {
  game = new Game(res);

  game.canvas = cnv;

  cnv.width = game.width;
  cnv.height = game.height;

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
