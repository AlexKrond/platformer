"use strict";

import c from "./const.js"
import detectCollision from "./detectCollision.js"
import GameObject from "./GameObject.js"

class Hero extends GameObject {
  #acceleration = c.acceleration;
  #startSpeed = c.startSpeed;
  #maxSpeed = c.maxSpeed;
  #jumpForce = c.jumpForce;

  constructor(props, game) {
    super(props);

    this.jump = props.jump || false;
    this.goLeft = props.goLeft || false;
    this.goRight = props.goRight || false;

    this.game = game;
  }

  update(deltaTime) {
    switch (true) {
      case this.goLeft:
        this.moveLeft();
        break;
      case this.goRight:
        this.moveRight();
        break;
      default:
        this.stopping();
    }

    this.yv = this.yv ? (this.yv + this.game.gravity) : this.game.gravity;

    let wasTopOrBottomCollision = false;
    this.game.platforms.forEach(platform => {
      const collideSide = detectCollision(this, platform, deltaTime);

      switch (collideSide) {
        case "side":
          this.xv = -this.xv * 0.5;
          break;

        case "top":
          wasTopOrBottomCollision = true;
          this.y = platform.y + platform.h;
          this.yv = 0;
          break;

        case "bottom":
          wasTopOrBottomCollision = true;
          this.y = platform.y - this.h;
          this.rebound(platform);
          break;
      }
    });

    this.game.bonuses.forEach(bonus => {
      const collideSide = detectCollision(this, bonus, deltaTime);

      if (collideSide !== "none") {
        this.game.bonusScore += 100;
        bonus.markedForDelete = true;
      }
    });

    if (wasTopOrBottomCollision) {
      this.x += this.xv / deltaTime;
    } else {
      super.update(deltaTime);
    }
  }

  moveLeft() {
    if (this.xv <= 0) {
      this.xv = this.xv ? (this.xv < -this.#maxSpeed) ? this.xv : (this.xv - this.#acceleration) : -this.#startSpeed;
    } else {
      this.stopping();
    }
  }

  moveRight() {
    if (this.xv >= 0) {
      this.xv = this.xv ? (this.xv > this.#maxSpeed) ? this.xv : (this.xv + this.#acceleration) : this.#startSpeed;
    } else {
      this.stopping();
    }
  }

  stopping() {
    this.xv = (this.xv < 10 && this.xv > -10) ? 0 : this.xv + (-this.xv * 0.2);
  }

  rebound(platform) {
    if ((this.y + this.h) >= platform.y) {
      if (this.jump) {
        this.yv = Math.min(-this.#jumpForce, -this.yv * this.game.bound);

      } else if (this.yv && ((this.yv - (this.yv * this.game.bound)) > 20)) {
        this.yv = -this.yv * this.game.bound;

      } else {
        this.yv = 0;
      }
    }
  }
}

export default Hero
