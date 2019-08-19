"use strict";

import GameObject from "./GameObject.js"
import CrashedPlatform from "./СrashedPlatform.js"

class Platform extends GameObject {
  constructor(props, game) {
    super(props, game);
    this.isCrashed = false;
  }

  update(deltaTime) {
    super.update(deltaTime);

    if (this.isCrashed) {
      this.markedForDeletion = true;
      this.game.crashedPlatforms.push(
          new CrashedPlatform({
            x: this.x,
            y: this.y,
            w: this.w,
            h: this.h,
            yv: 50,
            color: "gray",
            collides: false
          }, this.game)
      );
    }
  }

  static spawnNew(game, bottomLine) {
    const num = Math.floor(Math.random() * game.width / 400 + Math.max(1, game.width / 500));

    for (let i = 0; i < num; i++) {
      const random = Math.random();
      const props = {
        x: random * 50 + i * game.width / num,
        y: random * -100 + bottomLine,
        w: random * 50 + 100,
        h: random * 10 + 20,
        color: "black"
      };

      game.platforms.push(new Platform(props, game));
    }
  }
}

export default Platform
