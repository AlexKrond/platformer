"use strict";

import Game from "./Game.js";
import Hero from "./Hero.js"
import Bonus from "./Bonus.js";
import Platform from "./Platform.js";

export const game = new Game(document.querySelector("#game"));

const bonus = new Bonus({
  x: 10,
  y: 20,
  w: 32,
  h: 32,
  xv: 0,
  yv: -15,
  collides: false
});

const hero = new Hero({
  x: 10,
  y: 20,
  w: 32,
  h: 32,
  xv: 0,
  yv: -15,
  collides: true
});

console.log(bonus);
console.log(hero);

hero.draw();