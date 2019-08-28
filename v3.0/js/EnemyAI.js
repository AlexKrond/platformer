"use strict";

/**
 * @param enemy
 * @param game
 */

class EnemyAI {
  constructor(enemy, game) {
    this.enemy = enemy;
    this.game = game;

    this.maxJumpHeight = (this.enemy.jumpForce * this.enemy.jumpForce * 0.98) / (2 * this.game.gravity);
    this.targetPlatform = null;
    this.beforeLastBottomCollidePlatform = this.enemy.lastBottomCollidePlatform;
    this.isJumping = false;
  }

  update() {
    if (!this.enemy.lastBottomCollidePlatform) return;

    // Перекрасить все платформы обратно в черный
    this.game.platforms.forEach(p => p.color = "black");

    if (this.targetPlatform) {
      // Выделим её красным
      this.targetPlatform.color = "red";

      if (this.enemy.lastBottomCollidePlatform === this.targetPlatform ||
          this.beforeLastBottomCollidePlatform !== this.enemy.lastBottomCollidePlatform) {
        this.targetPlatform = null;
        this.isJumping = false;
        return;
      }

      this.enemy.jump = true;
      if (this.enemy.yv > -this.enemy.jumpForce * 0.95 && !this.isJumping) return;
      this.isJumping = true;


      switch (true) {
        case ((this.targetPlatform.x + this.targetPlatform.w) < this.enemy.x ||
            (this.targetPlatform.x < this.enemy.x &&
                (this.enemy.y + this.enemy.h) < this.targetPlatform.y)):
          if (this.enemy.x > (this.targetPlatform.x + this.targetPlatform.w +
              this.enemy.xv / this.enemy.horizontalBraking + 10)) {
            this.enemy.goLeft = true;
          } else if ((this.enemy.x + this.enemy.w + this.enemy.xv / this.enemy.horizontalBraking) <=
              (this.targetPlatform.x + this.targetPlatform.w)) {
            this.enemy.goLeft = false;
            this.enemy.jump = false;
          } else if ((this.enemy.y + this.enemy.h) < this.targetPlatform.y) {
            this.enemy.goLeft = true;
          } else {
            this.enemy.goLeft = false;
          }
          break;

        case (this.targetPlatform.x > (this.enemy.x + this.enemy.w) ||
            ((this.targetPlatform.x + this.targetPlatform.w) > (this.enemy.x + this.enemy.w) &&
                (this.enemy.y + this.enemy.h) < this.targetPlatform.y)):
          if ((this.enemy.x + this.enemy.w) < (this.targetPlatform.x -
              this.enemy.xv / this.enemy.horizontalBraking - 10)) {
            this.enemy.goRight = true;
          } else if ((this.enemy.x + this.enemy.xv / this.enemy.horizontalBraking) >=
              this.targetPlatform.x) {
            this.enemy.goRight = false;
            this.enemy.jump = false;
          } else if ((this.enemy.y + this.enemy.h) < this.targetPlatform.y) {
            this.enemy.goRight = true;
          } else {
            this.enemy.goRight = false;
          }
          break;

        default:
          this.targetPlatform = null;
          this.isJumping = false;
          break;
      }

    } else {
      this.enemy.goLeft = false;
      this.enemy.goRight = false;
      this.enemy.jump = false;

      if ((this.enemy.x + this.enemy.w) < this.game.hero.x) {

        if ((this.enemy.x + this.enemy.w + this.enemy.xv / this.enemy.horizontalBraking) <
            (this.enemy.lastBottomCollidePlatform.x + this.enemy.lastBottomCollidePlatform.w)) {
          this.targetPlatform = this.getPlatform("right");
          if (!this.targetPlatform || this.targetPlatform.y > this.enemy.lastBottomCollidePlatform.y) {
            this.targetPlatform = null;
            this.enemy.goRight = true;
          }
        } else {
          this.targetPlatform = this.getPlatform("right");
        }

      } else if (this.enemy.x > (this.game.hero.x + this.game.hero.w)) {

        if ((this.enemy.x + this.enemy.xv / this.enemy.horizontalBraking) >
            this.enemy.lastBottomCollidePlatform.x) {
          this.targetPlatform = this.getPlatform("left");
          if (!this.targetPlatform || this.targetPlatform.y > this.enemy.lastBottomCollidePlatform.y) {
            this.targetPlatform = null;
            this.enemy.goLeft = true;
          }
        } else {
          this.targetPlatform = this.getPlatform("left");
        }
      }
      this.beforeLastBottomCollidePlatform = this.enemy.lastBottomCollidePlatform;
    }
  }

  getPlatform(side) {
    let platform = null;
    let check;
    switch (side) {
      case "left":
        check = this.checkLeftPlat.bind(this);
        break;
      case "right":
        check = this.checkRightPlat.bind(this);
        break;
      default:
        throw new Error(`Неправильная сторона. side=${side}`);
    }

    this.game.platforms.forEach(p => {
      if (check(p)) {
        platform = platform ? ((p.y < platform.y) ? p : platform) : p;
      }
    });

    return platform;
  }

  checkRightPlat(p) {
    const distance = p.x - (this.enemy.x + this.enemy.w);
    const height = -p.y + this.enemy.lastBottomCollidePlatform.y;

    return (distance > 0 &&
        distance < 300 &&
        height < this.maxJumpHeight &&
        p.y > 0)
  }

  checkLeftPlat(p) {
    const distance = this.enemy.x - (p.x + p.w);
    const height = -p.y + this.enemy.lastBottomCollidePlatform.y;

    return (distance > 0 &&
        distance < 300 &&
        height < this.maxJumpHeight &&
        p.y > 0)
  }
}

export default EnemyAI
