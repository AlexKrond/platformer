"use strict";

import c from "./const.js"
import detectCollision from "./detectCollision.js"
import GameObject from "./GameObject.js"
import Sprite from "./Sprite.js"

class Character extends GameObject {
  constructor(props, game) {
    super(props, game);

    this.acceleration = c.acceleration;
    this.startSpeed = c.startSpeed;
    this.maxSpeed = c.maxSpeed;
    this.jumpForce = c.jumpForce;
    this.horizontalBraking = c.horizontalBraking;
    this.nullifyHorizontalSpeed = c.nullifyHorizontalSpeed;

    this.jump = props.jump || false;
    this.goLeft = props.goLeft || false;
    this.goRight = props.goRight || false;

    this.lastBottomCollidePlatform = null;
    this.wasTopCollision = false;
    this.wasBottomCollision = false;

    // this.sprite = null;
  }

  update(deltaTime) {
    this.checkHorizontalMoving(deltaTime);
    this.checkCollisionsWithPlatforms(deltaTime);
    this.updatePosition(deltaTime);
  }

  draw(ctx) {
    super.draw(ctx);
  }

  moveLeft(deltaTime) {
    if (this.xv <= 0) {
      if (this.xv <= -this.startSpeed) {

        if (this.xv < -this.maxSpeed) {
          this.xv = -this.maxSpeed;
        } else {
          this.xv = this.xv - this.acceleration * deltaTime;
        }

      } else {
        this.xv = -this.startSpeed;
      }

    } else {
      this.stopping(deltaTime);
    }
  }

  moveRight(deltaTime) {
    if (this.xv >= 0) {
      if (this.xv >= this.startSpeed) {

        if (this.xv > this.maxSpeed) {
          this.xv = this.maxSpeed;
        } else {
          this.xv = this.xv + this.acceleration * deltaTime;
        }

      } else {
        this.xv = this.startSpeed;
      }

    } else {
      this.stopping(deltaTime);
    }
  }

  stopping(deltaTime) {
    if (this.xv < this.nullifyHorizontalSpeed && this.xv > -this.nullifyHorizontalSpeed) {
      this.xv = 0;
    } else {
      this.xv = this.xv + (-this.xv * this.horizontalBraking * deltaTime);
    }
  }

  rebound(platform) {
    if ((this.y + this.h) >= platform.y) {
      if (this.jump) {
        this.yv = Math.min(-this.jumpForce, -this.yv * this.game.bounce);

      } else if (this.yv && ((this.yv - (this.yv * this.game.bounce)) > this.game.nullifyBounce)) {
        this.yv = -this.yv * this.game.bounce;

      } else {
        this.yv = 0;
      }
    }
  }

  checkHorizontalMoving(deltaTime) {
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
  }

  checkCollisionsWithPlatforms(deltaTime) {
    this.wasTopCollision = false;
    this.wasBottomCollision = false;

    this.game.platforms.forEach(platform => {
      const collideSide = detectCollision(this, platform, deltaTime);

      switch (collideSide) {
        case "side":
          this.xv = -this.xv * 0.5;
          break;

        case "top":
          this.wasTopCollision = true;
          this.y = platform.y + platform.h;
          this.yv = 0;
          break;

        case "bottom":
          this.wasBottomCollision = true;

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
  }

  updatePosition(deltaTime) {
    if (this.wasTopCollision || this.wasBottomCollision) {
      this.x += this.xv * deltaTime;
    } else {
      super.update(deltaTime);
    }
  }
}

export default Character
