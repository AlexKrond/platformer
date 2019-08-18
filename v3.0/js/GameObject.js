"use strict";

import c from "./const.js"

class GameObject {
  constructor({x, y, w, h, xv = 0, yv = 0, collides = true, isMoving = true, color = "white"}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.xv = xv;
    this.yv = yv;
    this.collides = collides;
    this.color = color;
    this.markedForDelete = false;
    this.isMoving = isMoving;
  }

  update(deltaTime) {
    if (this.isMoving) {
      this.y += c.screenMoveSpeed / deltaTime;
    }

    this.x += this.xv / deltaTime;
    this.y += this.yv / deltaTime;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

export default GameObject
