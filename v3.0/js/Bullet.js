"use strict";

import GameObject from "./GameObject.js"

class Bullet extends GameObject {
  constructor(props, owner, game) {
    super(props, game);

    this.owner = owner;

    this.w = 2;
    this.h = 2;
  }

}

export default Bullet
