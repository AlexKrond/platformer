"use strict";

import GameObject from "./GameObject.js"

class Bullet extends GameObject {
  constructor(props, owner, game) {
    super(props, game);
    this.owner = owner;

    this.damage = 1;

    this.w = 3;
    this.h = this.w;
  }

  markForDeletion() {
    if (this.y > this.game.height + this.game.hero.h ||
        (this.x + this.w) < 0 ||
        this.x > this.game.width) {
      this.markedForDeletion = true;
    }
  }

  draw(ctx) {
    ctx.fillStyle = "#b87333";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI);
    ctx.fill();
  }
}

export default Bullet
