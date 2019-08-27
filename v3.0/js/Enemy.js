"use strict";

import Character from "./Character.js"
import EnemyAI from "./EnemyAI.js"
import Weapon from "./Weapon.js"
import detectCollision from "./detectCollision.js"

class Enemy extends Character {
  constructor(props, game) {
    super(props, game);
    this.health = 100;
    this.AI = new EnemyAI(this, game);
    this.weapon = new Weapon({
      x: this.x + this.w / 2,
      y: this.y + this.h / 2,
      w: 20,
      h: 5,
      collides: false,
      color: "red"
    }, this, game);
  }

  update(deltaTime) {
    this.AI.update();
    super.update(deltaTime);
    this.checkForBullets(deltaTime);

    this.weapon.update(deltaTime);

    const distance = Math.sqrt((this.game.hero.x - this.x) * (this.game.hero.x - this.x) +
        (this.game.hero.y - this.y) * (this.game.hero.y - this.y));
    if (distance <= 400) {
      this.weapon.fire(deltaTime,
          this.game.hero.x + this.game.hero.w / 2,
          this.game.hero.y + this.game.hero.h / 2);
    }

    if (this.health <= 0) {
      this.markedForDeletion = true;
    }
  }

  draw(ctx) {
    super.draw(ctx);
    this.weapon.draw(ctx);

    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.font = "15px Arial";
    ctx.fillText(this.health.toString(), this.x + this.w / 2, this.y - 10);
  }

  checkForBullets(deltaTime) {
    this.game.hero.weapon.bullets.forEach(bullet => {
      const collideSide = detectCollision(this, bullet, deltaTime);

      if (collideSide !== "none") {
        this.health -= bullet.damage;
        bullet.markedForDeletion = true;
      }
    });
  }
}

export default Enemy
