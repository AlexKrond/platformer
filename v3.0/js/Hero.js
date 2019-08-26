"use strict";

import Character from "./Character.js"
import detectCollision from "./detectCollision.js"
import Sprite from "./Sprite.js"

class Hero extends Character {
  static img = new Image();

  constructor(props, game) {
    super(props, game);
    this.sprite = new Sprite({frameWidth: 200, frameHeight: 200}, this);
  }

  update(deltaTime) {
    super.checkHorizontalMoving(deltaTime);
    super.checkCollisionsWithPlatforms(deltaTime);

    this.checkCollisionsWithBonuses(deltaTime);

    super.updatePosition(deltaTime);

    this.sprite.update(deltaTime, this.wasBottomCollision);
  }

  draw(ctx) {
    this.sprite.draw(ctx);
  }

  checkCollisionsWithBonuses(deltaTime) {
    this.game.bonuses.forEach(bonus => {
      const collideSide = detectCollision(this, bonus, deltaTime);

      if (collideSide !== "none") {
        this.game.bonusScore += 100;
        bonus.markedForDeletion = true;
      }
    });
  }
}

export default Hero
