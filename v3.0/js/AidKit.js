"use strict";

import Bonus from "./Bonus.js"

class AidKit extends Bonus {
  constructor(props, game) {
    super(props, game);
    this.currentSpriteState = this.spriteState.aidKit;
  }
}

export default AidKit
