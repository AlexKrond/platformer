"use strict";

import GameObject from "./GameObject.js"

class Bullet extends GameObject {
  constructor(props, owner, game) {
    super(props, game);
    this.owner = owner;

    this.damage = 1;

    this.w = 5;
    this.h = this.w;
  }

  markForDeletion() {
    if (this.y > this.game.height + this.game.hero.h ||
        (this.x + this.w) < 0 ||
        this.x > this.game.width) {
      this.markedForDeletion = true;
    }
  }
}

export default Bullet
