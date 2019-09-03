"use strict";

import Bonus from "./Bonus.js"

class Coin extends Bonus {
  constructor(props, game) {
    super(props, game);
    this.currentSpriteState = this.spriteState.coin;
  }

  draw(ctx) {
    ctx.drawImage(
        Bonus.img,

        this.currentSpriteState[0] * this.frameWidth + 50,
        this.currentSpriteState[1] * this.frameHeight + 50,
        100,
        100,

        this.x,
        this.y,
        this.w,
        this.h
    );
  }

  applyEffect() {
    this.game.bonusScore += 100;
  }
}

export default Coin
