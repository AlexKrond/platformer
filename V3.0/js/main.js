"use strict";

import Hero from "./Hero.js"
import Bonus from "./Bonus.js";


const bonus = new Bonus({
  x: 10,
  y: 20,
  w: 32,
  h: 32,
  xv: 0,
  yv: -15,
  collides: false
});

console.log(bonus);

const hero = new Hero({
  x: 10,
  y: 20,
  w: 32,
  h: 32,
  xv: 0,
  yv: -15,
  collides: true
});

console.log(hero);
