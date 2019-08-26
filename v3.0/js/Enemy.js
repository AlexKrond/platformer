"use strict";

import Character from "./Character.js"
import EnemyAI from "./EnemyAI.js"

class Enemy extends Character{
  constructor(props, game) {
    super(props, game);
    this.AI = new EnemyAI(this, game);
  }

  update(deltaTime) {
    this.AI.update();
    super.update(deltaTime);
  }
}

export default Enemy
