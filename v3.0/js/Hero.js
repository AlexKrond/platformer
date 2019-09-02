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

    this.spriteStates = {
      moveRight: new SpriteState([1, 2, 3, 4, 5], 0, "cyclical"),
      standRight: new SpriteState([1], 0, "single"),
      jumpRight: new SpriteState([0], 0, "single"),
      jumpLeft: new SpriteState([6], 0, "single"),
      standLeft: new SpriteState([7], 0, "single"),
      moveLeft: new SpriteState([7, 8, 9, 10, 11], 0, "cyclical")
    };
    this.sprite = new Sprite(200, 200, this.spriteStates.standRight, this);
    this.afterBottomCollisionTimer = 0;

    this.fire = false;
    this.clientX = null;
    this.clientY = null;
    this.weapon = new Weapon({
      x: this.x + this.w / 2,
      y: this.y + this.h / 2,
      w: 60,
      h: 24,
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

    this.spriteStateUpdate(deltaTime);
    this.sprite.update(deltaTime);
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

  spriteStateUpdate(deltaTime) {
    if (this.xv < 0) this.sprite.currentState = this.spriteStates.moveLeft;
    if (this.xv > 0) this.sprite.currentState = this.spriteStates.moveRight;

    if (this.xv === 0 || this.yv !== 0) {
      switch (this.sprite.currentState) {
        case this.spriteStates.moveLeft:
        case this.spriteStates.jumpLeft:
        case this.spriteStates.standLeft:
          this.sprite.currentState = this.spriteStates.standLeft;
          break;

        case this.spriteStates.moveRight:
        case this.spriteStates.jumpRight:
        case this.spriteStates.standRight:
          this.sprite.currentState = this.spriteStates.standRight;
          break;
      }
    }

    if (this.wasBottomCollision) this.afterBottomCollisionTimer = 0;
    this.afterBottomCollisionTimer += 1000 * deltaTime;

    if (!this.wasBottomCollision && this.afterBottomCollisionTimer > 200) {
      switch (this.sprite.currentState) {
        case this.spriteStates.moveLeft:
        case this.spriteStates.standLeft:
          this.sprite.currentState = this.spriteStates.jumpLeft;
          break;

        case this.spriteStates.moveRight:
        case this.spriteStates.standRight:
          this.sprite.currentState = this.spriteStates.jumpRight;
          break;
      }
    }
  }
}

export default Hero
