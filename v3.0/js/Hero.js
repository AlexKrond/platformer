"use strict";

import Character from "./Character.js"
import detectCollision from "./detectCollision.js"
import Sprite from "./Sprite.js"
import SpriteState from "./SpriteState.js"
import Weapon from "./Weapon.js"

class Hero extends Character {
  static img = new Image();

  constructor(props, game) {
    super(props, game);
    this.game = game;
    this.health = 100;

    let spriteStates = {
      moveRight: new SpriteState([1, 2, 3, 4, 5], 1, "12"),
      standRight: new SpriteState([1], 1, "12"),
      jumpRight: new SpriteState([0], 1, "12"),
      jumpLeft: new SpriteState([6], 1, "12"),
      standLeft: new SpriteState([7], 1, "12"),
      moveLeft: new SpriteState([7, 8, 9, 10, 11], 1, "12")
    };
    this.sprite = new Sprite({frameWidth: 200, frameHeight: 200, spriteStates}, this);

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
