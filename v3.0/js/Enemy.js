"use strict";

import Character from "./Character.js"
import EnemyAI from "./EnemyAI.js"
import Weapon from "./Weapon.js"

class Enemy extends Character {
  constructor(props, game) {
    super(props, game);
    this.AI = new EnemyAI(this, game);
    this.weapon = new Weapon({
      x: this.x + this.w / 2,
      y: this.y + this.h / 2,
      w: 20,
      h: 5,
      collides: false,
      color: "red"
    }, this, game);
  }

  update(deltaTime) {
    this.AI.update();
    super.update(deltaTime);

    this.weapon.update(deltaTime);
  }

  draw(ctx) {
    super.draw(ctx);
    this.weapon.draw(ctx);
  }
}

export default Enemy
