"use strict";

import c from "./const.js"
import Hero from "./Hero.js"
import Bonus from "./Bonus.js";
import Platform from "./Platform.js";

class Game {
  constructor() {
    this.width = c.gameWidth;
    this.height = c.gameHeight;

    this.hero = new Hero({
      x: 10,
      y: 20,
      w: 32,
      h: 32,
      xv: 15,
      yv: 10,
      collides: true,
      color: "red"
    });

    this.bonus = new Bonus({
      x: 10,
      y: 20,
      w: 32,
      h: 32,
      xv: 10,
      yv: 15,
      collides: true,
      color: "gold"
    });

    console.log(this.bonus);
    console.log(this.hero);
  }

  update(deltaTime) {
    this.hero.update(deltaTime);
    this.bonus.update(deltaTime);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);

    this.hero.draw(ctx);
    this.bonus.draw(ctx);
  }
}

export default Game
