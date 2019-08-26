"use strict";

class EnemyAI {
  constructor(enemy, game) {
    this.enemy = enemy;
    this.game = game;
  }

  update() {
    if ((this.enemy.x + this.enemy.w) < (this.game.hero.x - this.game.hero.w)) {
      this.enemy.goLeft = false;
      // this.enemy.goRight = true;
      this.enemy.goRight = Math.random() < 0.8;
    } else if (this.enemy.x > (this.game.hero.x + 2 * this.game.hero.w)) {
      // this.enemy.goLeft = true;
      this.enemy.goLeft = Math.random() < 0.8;
      this.enemy.goRight = false;
    } else {
      this.enemy.goLeft = Math.random() < 0.3;
      this.enemy.goRight = Math.random() < 0.3;
    }

    if (this.enemy.y > this.game.hero.y) {
      this.enemy.jump = true;
    } else {
      this.enemy.jump = false;
    }
  }
}

export default EnemyAI
