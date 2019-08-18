"use strict";

import GameObject from "./GameObject.js";

class Platform extends GameObject {
  constructor(props) {
    super(props);
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

      game.platforms.push(new Platform(props));
    }
  }
}

export default Platform
