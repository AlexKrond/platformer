"use strict";

import Bonus from "./Bonus.js"

class AidKit extends Bonus {
  constructor(props, game) {
    super(props, game);
    this.currentSpriteState = this.spriteState.aidKit;
    this.restoreHealth = 30;
  }

  applyEffect() {
    this.game.hero.health = (this.game.hero.health > (100 - this.restoreHealth)) ?
        100 : (this.game.hero.health + this.restoreHealth);
  }
}

export default AidKit
