"use strict";

import GameObject from "./GameObject.js"
import Bullet from "./Bullet.js"
import SpriteState from "./SpriteState.js"
import Sprite from "./Sprite.js"

class Weapon extends GameObject {
  static img = new Image();

  constructor(props, owner, game) {
    super(props, game);
    this.owner = owner;
    this.game = game;

    this.bulletsSpeed = 1000;
    this.maxRoundsInMagazine = 10;
    this.rateOfFire = 0.3;
    this.reloadTime = 5;
    this.bulletDamage = props.bulletDamage || 1;
    this.currentRoundsInMagazine = this.maxRoundsInMagazine;
    this.currentRateOfFire = this.rateOfFire;
    this.currentReloadTime = this.reloadTime;

    this.bullets = [];
    this.xTarget = null;
    this.yTarget = null;
    this.angle = 0;

    this.spriteStates = {
      right: new SpriteState([1], 0, "single"),
      left: new SpriteState([0], 0, "single")
    };
    this.sprite = new Sprite(362, 145, this.spriteStates.right, this, 10);
  }

  update(deltaTime, xTarget, yTarget) {
    this.xTarget = xTarget;
    this.yTarget = yTarget;
    this.x = this.owner.x + this.owner.w / 2;
    this.y = this.owner.y + this.owner.h / 2;

    this.bullets.forEach(bullet => {
      bullet.markForDeletion();
      bullet.screenMoving(deltaTime);
      bullet.gravityEffect(deltaTime);
      bullet.update(deltaTime);
    });

    this.bullets = this.bullets.filter(bullet => !bullet.markedForDeletion);

    if (this.currentRoundsInMagazine <= 0) this.reload(deltaTime);
    if (this.currentRateOfFire > 0) this.currentRateOfFire -= deltaTime;

    this.spriteStateUpdate();
    this.sprite.update(deltaTime);
  }

  draw(ctx) {
    if (!this.xTarget || !this.yTarget) {
      this.angle = 0;
    } else {
      this.angle = Math.atan2(this.yTarget - this.y, this.xTarget - this.x);
    }
    ctx.fillStyle = this.color;

    this.bullets.forEach(bullet => bullet.draw(ctx));

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    this.sprite.draw(ctx, -10, -this.h / 2);
    ctx.restore();
  }

  fire(deltaTime) {
    if (this.currentRoundsInMagazine <= 0 || this.currentRateOfFire > 0) return;

    this.currentRateOfFire = this.rateOfFire;
    this.currentRoundsInMagazine--;

    let xBulletSpeed = this.xTarget - this.x;
    let yBulletSpeed = this.yTarget - this.y;
    let bulletSpeed = Math.sqrt(xBulletSpeed * xBulletSpeed + yBulletSpeed * yBulletSpeed);
    let factor = bulletSpeed / this.bulletsSpeed;
    this.bullets.push(
        new Bullet({
          x: this.x,
          y: this.y,
          xv: xBulletSpeed / factor,
          yv: yBulletSpeed / factor,
          collides: true,
          gravityIsUsed: true,
          color: "green",
          damage: this.bulletDamage
        }, this.owner, this.game)
    );
  }

  reload(deltaTime) {
    this.currentReloadTime = (this.currentReloadTime >= this.reloadTime) ?
        deltaTime : (this.currentReloadTime + deltaTime);
    if (this.currentReloadTime >= this.reloadTime) {
      this.currentRoundsInMagazine = this.maxRoundsInMagazine;
    }
  }

  spriteStateUpdate() {
    if (Math.abs(this.angle) > Math.PI / 2) this.sprite.currentState = this.spriteStates.left;
    if (Math.abs(this.angle) < Math.PI / 2) this.sprite.currentState = this.spriteStates.right;
  }
}

export default Weapon
