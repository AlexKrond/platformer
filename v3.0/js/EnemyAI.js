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
    this.xForMaxY = this.getXForMaxY();
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
      if (p !== this.enemy.lastBottomCollidePlatform && check(p)) {
        platform = platform ? ((p.y < platform.y) ? p : platform) : p;
      }
    });

    return platform;
  }

  checkRightPlat(p) {
    const x = p.x - (this.enemy.x + this.enemy.w / 2);
    const height = -p.y + this.enemy.lastBottomCollidePlatform.y;

    return (x > (this.enemy.w / 2) && height < this.maxJumpHeight && p.y > 0 &&
        (p.y >= (this.enemy.lastBottomCollidePlatform.y - this.motionEquation(x)) ||
            x <= this.xForMaxY));
  }

  checkLeftPlat(p) {
    const x = (this.enemy.x + this.enemy.w / 2) - (p.x + p.w);
    const height = -p.y + this.enemy.lastBottomCollidePlatform.y;

    return (x > (this.enemy.w / 2) && height < this.maxJumpHeight && p.y > 0 &&
        (p.y >= (this.enemy.lastBottomCollidePlatform.y - this.motionEquation(x)) ||
            x <= this.xForMaxY));
  }

  motionEquation(x) {
    let t = EnemyAI.getMaxRootOfTheQuadraticEquation({
      a: this.enemy.acceleration / 2,
      b: this.enemy.startSpeed,
      c: -x
    });

    if ((this.enemy.acceleration * t * t) / 2 > (this.enemy.maxSpeed - this.enemy.startSpeed)) {
      t = (x - this.enemy.maxSpeed + this.enemy.startSpeed) / this.enemy.startSpeed;
    }

    return this.enemy.jumpForce * t - (this.game.gravity * t * t) / 2;
  }

  static getMaxRootOfTheQuadraticEquation(params) {
    const {x1, x2} = EnemyAI.solveQuadraticEquation(params);
    return Math.max(x1, x2);
  }

  static solveQuadraticEquation({a, b, c}) {
    let x1, x2;
    let d = b * b - 4 * a * c;
    if (d >= 0) {
      x1 = (-b + Math.sqrt(d)) / (2 * a);
      x2 = (-b - Math.sqrt(d)) / (2 * a);
    } else {
      throw new Error("Корни комплексные");
    }

    return {x1, x2};
  }

  getXForMaxY() {
    let y = -1,
        prevY = -2,
        x;
    for (x = 0; y > prevY; x++) {
      prevY = y;
      y = this.motionEquation(x);
    }
    return x;
  }
}

export default EnemyAI
