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

    Bonus.img.src = "sprites/bonus.png";

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
      }, this),
      new Bonus({
        x: 1000,
        y: 200,
        w: 32,
        h: 32,
        color: "gold"
      }, this)
    ];

    new InputHandler(this.hero);


    // console.log(this.hero);
    // console.log(this.bonus);
  }

  start() {
    this.platforms = [
      new Platform({
        x: this.width / 2 - 100,
        y: this.height - 100,
        w: 200,
        h: 30,
        color: "black"
      })
    ];

    for (let i = 0; i < (this.height / 200); i++) {
      Platform.spawnNew(this, i * 200 - 100);
    }
  }

  screenMoving(deltaTime) {
    [...this.platforms, ...this.bonus, this.hero].forEach(gameObject => gameObject.screenMoving(deltaTime));
  }

  update(deltaTime) {
    [...this.platforms, ...this.bonus, this.hero].forEach(gameObject => gameObject.update(deltaTime));
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.width, this.height);

    [...this.platforms, ...this.bonus, this.hero].forEach(gameObject => gameObject.draw(ctx));
  }
}

export default Game
