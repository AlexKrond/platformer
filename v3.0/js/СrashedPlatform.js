"use strict";

import GameObject from "./GameObject.js"

class CrashedPlatform extends GameObject {
  constructor(props, game) {
    super(props, game);
  }

  draw(ctx) {
    const angle = 35;

    ctx.fillStyle = this.color;

    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.rotate(angle * Math.PI / 180);

    ctx.fillRect(0, 0, this.w / 2, this.h);

    ctx.restore();
    ctx.save();
    ctx.translate(this.x + this.w, this.y);

    ctx.rotate((90 - angle) * Math.PI / 180);
    ctx.fillRect(0, 0, this.h, this.w / 2);

    ctx.restore();
  }
}

export default CrashedPlatform
