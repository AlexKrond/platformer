"use strict";

import GameObject from "./GameObject.js"
import Bullet from "./Bullet.js"

class Weapon extends GameObject {
  constructor(props, owner, game) {
    super(props, game);
    this.owner = owner;
    this.game = game;
    this.bullets = [];

    this.spawnBullet = this.spawnBullet.bind(this);
    window.addEventListener("click", this.spawnBullet);
  }

  spawnBullet(event) {
    this.bullets.push(
        new Bullet({
          x: this.x,
          y: this.y,
          xv: this.game.hero.x + this.game.hero.w / 2 - this.x,
          yv: this.game.hero.y + this.game.hero.h / 2 - this.y,
          collides: false,
          color: "green"
        }, this.owner, this.game)
    );
  }

  update(deltaTime) {
    this.x = this.owner.x + this.owner.w / 2;
    this.y = this.owner.y + this.owner.h / 2 - this.h / 2;

    this.bullets.forEach(bullet => bullet.update(deltaTime));
  }

  draw(ctx) {
    super.draw(ctx);
    this.bullets.forEach(bullet => bullet.draw(ctx));
  }
}

export default Weapon