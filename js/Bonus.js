"use strict";

import GameObject from "./GameObject.js"
import detectCollision from "./detectCollision.js";

class Bonus extends GameObject {
  constructor(props, game) {
    super(props, game);

    this.frameWidth = 200;
    this.frameHeight = 200;

    this.spriteState = {
      aidKit: [0, 0],
      coin: [1, 0]
    };
    this.currentSpriteState = null;
  }

  update(deltaTime) {
    let wasBottomCollision = false;
    this.game.platforms.forEach(platform => {
      const collideSide = detectCollision(this, platform, deltaTime);

      if (collideSide === "bottom") {
        wasBottomCollision = true;
        this.y = platform.y - this.h;
        this.rebound(platform);
      }
    });

    if (!wasBottomCollision) {
      super.update(deltaTime);
    }
  }

  draw(ctx) {
    ctx.drawImage(
        this.game.res.get("bonus"),

        this.currentSpriteState[0] * this.frameWidth,
        this.currentSpriteState[1] * this.frameHeight,
        this.frameWidth,
        this.frameHeight,

        this.x,
        this.y,
        this.w,
        this.h
    );
  }

  rebound(platform) {
    if ((this.y + this.h) >= platform.y) {
      if (this.yv && ((this.yv - (this.yv * this.game.bounce)) > this.game.nullifyBounce)) {
        this.yv = -this.yv * this.game.bounce;

      } else {
        this.yv = 0;
      }
    }
  }

  applyEffect() {
    throw new Error("Не реализовано");
  }
}

export default Bonus
