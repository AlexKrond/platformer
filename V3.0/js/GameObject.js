"use strict";

import {game} from "./main.js"

class GameObject {
  constructor({x, y, w, h, xv, yv, collides = true, color = "white"}) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.xv = xv;
    this.yv = yv;
    this.collides = collides;
    this.color = color;
  }

  draw() {
    game.ctx.fillRect(this.x, this.y, this.w, this.h);
  }
}

export default GameObject