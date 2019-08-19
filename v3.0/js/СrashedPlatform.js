"use strict";

import GameObject from "./GameObject.js"

class CrashedPlatform extends GameObject {
  constructor(props, game) {
    super(props, game);
  }

  draw(ctx) {
    const angle = 35;

    context.fillStyle = "gray";

    context.save();
    context.translate(this.x, this.y);

    context.rotate(angle * Math.PI / 180);

    context.fillRect(0, 0, this.w / 2, this.h);

    context.restore();
    context.save();
    context.translate(this.x + this.w, this.y);

    context.rotate((90 - angle) * Math.PI / 180);
    context.fillRect(0, 0, this.h, this.w / 2);

    context.restore();
  }
}
