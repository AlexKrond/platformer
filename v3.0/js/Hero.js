"use strict";

import Character from "./Character.js"
import detectCollision from "./detectCollision.js"
import Sprite from "./Sprite.js"
import Weapon from "./Weapon.js"

class Hero extends Character {
  static img = new Image();

  constructor(props, game) {
    super(props, game);
    this.game = game;
    this.health = 100;

    this.sprite = new Sprite({frameWidth: 200, frameHeight: 200}, this);

    this.fire = false;
    this.clientX = null;
    this.clientY = null;
    this.weapon = new Weapon({
      x: this.x + this.w / 2,
      y: this.y + this.h / 2,
      w: 20,
      h: 5,
      collides: false,
      color: "red"
    }, this, this.game);
  }

  update(deltaTime) {
    super.checkHorizontalMoving(deltaTime);
    super.checkCollisionsWithPlatforms(deltaTime);

    this.checkCollisionsWithBonuses(deltaTime);
    this.checkForBullets(deltaTime);

    super.updatePosition(deltaTime);

    this.weapon.update(deltaTime);
    if (this.fire) {
      let rect = this.game.canvas.getBoundingClientRect();
      this.weapon.fire(deltaTime, this.clientX - rect.left, this.clientY - rect.top);
    }

    this.sprite.update(deltaTime, this.wasBottomCollision);
  }

  draw(ctx) {
    this.sprite.draw(ctx);
    this.weapon.draw(ctx);

    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.font = "15px Arial";
    ctx.fillText(this.health.toString(), this.x + this.w / 2, this.y - 10);
  }

  checkCollisionsWithBonuses(deltaTime) {
    this.game.bonuses.forEach(bonus => {
      const collideSide = detectCollision(this, bonus, deltaTime);

      if (collideSide !== "none") {
        this.game.bonusScore += 100;
        bonus.markedForDeletion = true;
      }
    });
  }

  checkForBullets(deltaTime) {
    this.game.enemies.forEach(enemy => {
      enemy.weapon.bullets.forEach(bullet => {
        const collideSide = detectCollision(this, bullet, deltaTime);

        if (collideSide !== "none") {
          this.health -= bullet.damage;
          bullet.markedForDeletion = true;
        }
      });
    });
  }
}

export default Hero
