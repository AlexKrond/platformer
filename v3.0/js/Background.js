"use strict";

import c from "./const.js"

class Background {
  static img = new Image();

  constructor({x, y, w, h}, game) {
    this.game = game;

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  screenMoving(deltaTime) {
    this.y += c.screenMoveSpeed * deltaTime;
  }

  draw(ctx) {
    ctx.drawImage(Background.img, -this.x, -this.y, this.game.width, this.game.height, 0, 0, this.game.width, this.game.height);
  }
}

export default Background
