"use strict";

import c from "./const.js"
import detectCollision from "./detectCollision.js"
import GameObject from "./GameObject.js"
import Sprite from "./Sprite.js"

class Hero extends GameObject {
  #acceleration = c.acceleration;
  #startSpeed = c.startSpeed;
  #maxSpeed = c.maxSpeed;
  #jumpForce = c.jumpForce;
  #horizontalBraking = c.horizontalBraking;
  #nullifyHorizontalSpeed = c.nullifyHorizontalSpeed;

  static img = new Image();

  constructor(props, game) {
    super(props, game);

    this.jump = props.jump || false;
    this.goLeft = props.goLeft || false;
    this.goRight = props.goRight || false;

    this.lastBottomCollidePlatform = null;

    this.sprite = new Sprite({frameWidth: 200, frameHeight: 200}, this);
  }

  update(deltaTime) {
    switch (true) {
      case this.goLeft:
        this.moveLeft(deltaTime);
        break;
      case this.goRight:
        this.moveRight(deltaTime);
        break;
      default:
        this.stopping(deltaTime);
    }

    this.yv = this.yv ? (this.yv + this.game.gravity * deltaTime) : this.game.gravity * deltaTime;

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

          if (platform.y < this.game.height * 0.66 &&
              Math.random() < this.game.crashPlatformFrequency &&
              platform !== this.lastBottomCollidePlatform) {
            platform.isCrashed = true;
          }

          this.lastBottomCollidePlatform = platform;
          break;
      }
    });

    this.game.bonuses.forEach(bonus => {
      const collideSide = detectCollision(this, bonus, deltaTime);

      if (collideSide !== "none") {
        this.game.bonusScore += 100;
        bonus.markedForDeletion = true;
      }
    });

    if (wasTopOrBottomCollision) {
      this.x += this.xv * deltaTime;
    } else {
      super.update(deltaTime);
    }

    this.sprite.update(deltaTime);
  }

  draw(ctx) {
    // ctx.drawImage(Hero.img, this.x, this.y, this.w, this.h);
    this.sprite.draw(ctx);
  }

  moveLeft(deltaTime) {
    if (this.xv <= 0) {
      if (this.xv <= -this.#startSpeed) {

        if (this.xv < -this.#maxSpeed) {
          this.xv = -this.#maxSpeed;
        } else {
          this.xv = this.xv - this.#acceleration * deltaTime;
        }

      } else {
        this.xv = -this.#startSpeed;
      }

    } else {
      this.stopping(deltaTime);
    }
  }

  moveRight(deltaTime) {
    if (this.xv >= 0) {
      if (this.xv >= this.#startSpeed) {

        if (this.xv > this.#maxSpeed) {
          this.xv = this.#maxSpeed;
        } else {
          this.xv = this.xv + this.#acceleration * deltaTime;
        }

      } else {
        this.xv = this.#startSpeed;
      }

    } else {
      this.stopping(deltaTime);
    }
  }

  stopping(deltaTime) {
    if (this.xv < this.#nullifyHorizontalSpeed && this.xv > -this.#nullifyHorizontalSpeed) {
      this.xv = 0;
    } else {
      this.xv = this.xv + (-this.xv * this.#horizontalBraking * deltaTime);
    }
  }

  rebound(platform) {
    if ((this.y + this.h) >= platform.y) {
      if (this.jump) {
        this.yv = Math.min(-this.#jumpForce, -this.yv * this.game.bounce);

      } else if (this.yv && ((this.yv - (this.yv * this.game.bounce)) > this.game.nullifyBounce)) {
        this.yv = -this.yv * this.game.bounce;

      } else {
        this.yv = 0;
      }
    }
  }
}

export default Hero
