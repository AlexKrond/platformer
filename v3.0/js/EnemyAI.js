"use strict";

class EnemyAI {
  constructor(enemy, game) {
    this.enemy = enemy;
    this.game = game;

    this.maxJumpHeight = (this.enemy.jumpForce * this.enemy.jumpForce * 0.9) / (2 * this.game.gravity);
    this.targetPlatform = null;
  }

  update() {
    if (this.targetPlatform) {
      // если на подлете goleft, Right = false, как только this.y < p.y => продолжить движение;
    }

    if ((this.enemy.x + this.enemy.w) < (this.game.hero.x - this.game.hero.w)) {
      if (this.enemy.lastBottomCollidePlatform && (this.enemy.x + this.enemy.w) < (this.enemy.lastBottomCollidePlatform.x + this.enemy.lastBottomCollidePlatform.w)) {
        this.enemy.goLeft = false;
        this.enemy.goRight = true;
      } else {
        this.enemy.goLeft = false;
        this.enemy.goRight = false;

        const platform = this.getRightPlat();
        if (platform) {
          this.targetPlatform = platform;
          this.enemy.jump = true;
          this.enemy.goRight = true; // перенести в обработку targetPlatform
        }
      }

    } else {
      this.enemy.goLeft = false;
      this.enemy.goRight = false;
      this.enemy.jump = false;
    }
    // } else if (this.enemy.x > (this.game.hero.x + 2 * this.game.hero.w)) {
    //   this.enemy.goLeft = Math.random() < 0.8;
    //   this.enemy.goRight = false;
    //
    // } else {
    //   this.enemy.goLeft = false;
    //   this.enemy.goRight = false;
    // }

    // if (this.enemy.y > this.game.hero.y) {
    //   this.enemy.jump = true;
    // } else {
    //   this.enemy.jump = false;
    // }
  }

  getRightPlat() {
    let platform;

    this.game.platforms.forEach(p => {
      const distance = p.x - (this.enemy.x + this.enemy.w);
      const height = p.y - (this.enemy.y + this.enemy.h);
      if (distance > 0 && distance < 300 &&
          height < this.maxJumpHeight) {
        platform = platform ? (p.y < platform.y) ? p : platform : p;
      }
    });

    return platform;
  }


  // update() {
  //   if ((this.enemy.x + this.enemy.w) < (this.game.hero.x - this.game.hero.w)) {
  //     this.enemy.goLeft = false;
  //     // this.enemy.goRight = true;
  //     this.enemy.goRight = Math.random() < 0.8;
  //   } else if (this.enemy.x > (this.game.hero.x + 2 * this.game.hero.w)) {
  //     // this.enemy.goLeft = true;
  //     this.enemy.goLeft = Math.random() < 0.8;
  //     this.enemy.goRight = false;
  //   } else {
  //     this.enemy.goLeft = Math.random() < 0.3;
  //     this.enemy.goRight = Math.random() < 0.3;
  //   }
  //
  //   if (this.enemy.y > this.game.hero.y) {
  //     this.enemy.jump = true;
  //   } else {
  //     this.enemy.jump = false;
  //   }
  // }
}

export default EnemyAI
