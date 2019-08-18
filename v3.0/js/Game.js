"use strict";

import c from "./const.js"
import InputHandler from "./InputHandler.js"
import Hero from "./Hero.js"
import Bonus from "./Bonus.js"
import Platform from "./Platform.js"

class Game {
  constructor() {
    this.width = c.gameWidth;
    this.height = c.gameHeight;

    this.screenMoveSpeed = c.screenMoveSpeed;

    this.crashFrequency = c.crashFrequency;
    this.bound = c.bound;
    this.gravity = c.gravity;

    this.hero = new Hero({
      x: this.width / 2 - c.hw / 2,
      y: this.height - c.hh - 100,
      w: c.hw,
      h: c.hh,
      yv: 0,
      color: "red"
    }, this);

    this.bonus = [
      new Bonus({
        x: 10,
        y: 20,
        w: 32,
        h: 32,
        color: "gold"
      })
    ];

    new InputHandler(this.hero);


    console.log(this.hero);
    console.log(this.bonus);
  }

  start() {
    this.platforms = [];

    for (let i = 0; i < (this.height / 200); i++) {
      Platform.spawnNew(this, i * 200 - 100);
    }
  }

  update(deltaTime) {
    [...this.platforms, ...this.bonus, this.hero].forEach(gameObject => gameObject.update(deltaTime));
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.width, this.height);

    [...this.platforms, ...this.bonus, this.hero].forEach(gameObject => gameObject.draw(ctx));
  }
}

export default Game
