"use strict";

import GameObject from "./GameObject.js"
import detectCollision from "./detectCollision.js";

class Bonus extends GameObject {
  static img = new Image();

  constructor(props, game) {
    super(props, game);
  }

  update(deltaTime) {
    this.yv = this.yv ? (this.yv + this.game.gravity * deltaTime) : this.game.gravity * deltaTime;

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
    ctx.drawImage(Bonus.img, 50, 50, 100, 100, this.x, this.y, this.w, this.h);
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
}

export default Bonus
