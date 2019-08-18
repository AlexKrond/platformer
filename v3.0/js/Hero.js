"use strict";

import GameObject from "./GameObject.js";
import c from "./const.js"

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

    super.update(deltaTime); // if not collide
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
}

export default Hero
