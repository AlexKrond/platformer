"use strict";

import GameObject from "./GameObject.js"

class Weapon extends GameObject {
  constructor(props, owner, game) {
    super(props, game);
    this.owner = owner;
  }

  update(deltaTime) {
    this.x = this.owner.x + this.owner.w / 2;
    this.y = this.owner.y + this.owner.h / 2 - this.h / 2;
  }
}

export default Weapon
