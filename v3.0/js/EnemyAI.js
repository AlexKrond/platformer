"use strict";

import Enemy from "./Enemy.js"
import c from "./const.js";

/**
 * @param enemy
 * @param game
 */

class EnemyAI {
  constructor(enemy, game) {
    this.enemy = enemy;
    this.game = game;

    // Максимальная высота прыжка
    // TODO: высота прыжка может быть больше при падении с большой высоты
    this.maxJumpHeight = (this.enemy.jumpForce * this.enemy.jumpForce * 0.98) / (2 * this.game.gravity);

    // Горизонтальное расстояние (при движении вправо или влево) для достижения максимальной высоты прыжка
    this.xForMaxJumpHeight = this.getXForMaxJumpHeight();

    this.targetPlatform = null;
    this.beforeLastBottomCollidePlatform = this.enemy.lastBottomCollidePlatform;
    this.xPosForJumpToTheTP = null;
    this.isJumping = false;
  }

  update() {
    // Если отсутствует последняя платформа на которую приземлялись (только отспавнились или платформа сломалась)
    // TODO: добавить обработку падения с поиском платформы для приземления
    if (!this.enemy.lastBottomCollidePlatform) return;

    // Перекрасим все платформы в черный, а целевую (если есть) в красный
    this.game.platforms.forEach(p => p.color = "black");
    if (this.targetPlatform) this.targetPlatform.color = "red";

    if (this.targetPlatform) {
      this.goToTheTargetPlatform();
    } else {
      this.findTargetPlatform();
    }
  }

  goToTheTargetPlatform() {
    if (this.xPosForJumpToTheTP) {
      this.goToXPosForJumpToTheTP();
    } else {
      this.jumpToTheTargetPlatform();
    }
  }

  goToXPosForJumpToTheTP() {
    this.enemy.goLeft = false;
    this.enemy.goRight = false;

    if ((this.enemy.x + this.enemy.xv / this.enemy.horizontalBraking) > this.xPosForJumpToTheTP + 3) {
      this.enemy.goLeft = true;
    } else if ((this.enemy.x + this.enemy.xv / this.enemy.horizontalBraking) < this.xPosForJumpToTheTP - 3) {
      this.enemy.goRight = true;
    } else {
      this.xPosForJumpToTheTP = null;
    }
  }

  jumpToTheTargetPlatform() {
    if (this.enemy.lastBottomCollidePlatform === this.targetPlatform ||
        this.beforeLastBottomCollidePlatform !== this.enemy.lastBottomCollidePlatform) {
      this.targetPlatform = null;
      this.isJumping = false;
      return;
    }

    this.enemy.jump = true;

    // Фактически, прыжок произойдет только после bottom коллизии
    if (this.enemy.yv > -this.enemy.jumpForce * 0.95 && !this.isJumping) return;
    this.isJumping = true;


    switch (true) {
      case ((this.targetPlatform.x + this.targetPlatform.w) < this.enemy.x ||
          (this.targetPlatform.x < this.enemy.x &&
              (this.enemy.y + this.enemy.h) < this.targetPlatform.y)):
        if (this.enemy.x > (this.targetPlatform.x + this.targetPlatform.w -
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

      // default:
      //   this.targetPlatform = null;
      //   this.isJumping = false;
      //   break;
    }
  }

  findTargetPlatform() {
    this.enemy.goLeft = false;
    this.enemy.goRight = false;
    this.enemy.jump = false;

    const plats = this.game.platforms.filter(p => (this.enemy.lastBottomCollidePlatform.y - p.y) < this.maxJumpHeight);

    let xMin = this.enemy.lastBottomCollidePlatform.x - this.enemy.w + 10;
    let xMax = this.enemy.lastBottomCollidePlatform.x + this.enemy.lastBottomCollidePlatform.w - 10;
    let tmpPlat;

    if ((this.enemy.x + this.enemy.w) < this.game.hero.x) {

      for (let x = xMax; x >= xMin; x -= 5) {
        tmpPlat = this.getPlatform(plats, x, "right");
        if (tmpPlat) {
          if (this.targetPlatform) {
            if (tmpPlat.y < this.targetPlatform.y) {
              this.targetPlatform = tmpPlat;
              this.xPosForJumpToTheTP = x;
            }
          } else {
            this.targetPlatform = tmpPlat;
            this.xPosForJumpToTheTP = x;
          }
        }
      }

    } else if (this.enemy.x > (this.game.hero.x + this.game.hero.w)) {

      for (let x = xMin; x <= xMax; x += 5) {
        this.targetPlatform = this.getPlatform(plats, x, "left");

        if (this.targetPlatform) {
          this.xPosForJumpToTheTP = x;
          break;
        }
      }

    }
    this.beforeLastBottomCollidePlatform = this.enemy.lastBottomCollidePlatform;
  }

  getPlatform(plats, xPos, side) {
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

    plats.forEach(p => {
      if (p !== this.enemy.lastBottomCollidePlatform && check(p, xPos)) {
        platform = platform ? ((p.y < platform.y) ? p : platform) : p;
      }
    });

    return platform;
  }

  // TODO: создать теневую копию противника и проверить допрыгнет или нет
  checkRightPlat(p, xPos) {
    const x = p.x - (xPos + this.enemy.w - 5);
    const height = -p.y + this.enemy.lastBottomCollidePlatform.y;

    return (p.y <= this.enemy.lastBottomCollidePlatform.y && // пока только платформы выше текущей
        x > 0 && height < this.maxJumpHeight && p.y > 0 &&
        (p.y >= (this.enemy.lastBottomCollidePlatform.y - this.motionEquation(x)) ||
            x <= this.xForMaxJumpHeight) && this.checkJumpOnShadowCopy(p, xPos));
  }

  checkLeftPlat(p, xPos) {
    const x = (xPos + 5) - (p.x + p.w);
    const height = -p.y + this.enemy.lastBottomCollidePlatform.y;

    return (p.y <= this.enemy.lastBottomCollidePlatform.y &&
        x > 0 && height < this.maxJumpHeight && p.y > 0 &&
        (p.y >= (this.enemy.lastBottomCollidePlatform.y - this.motionEquation(x)) ||
            x <= this.xForMaxJumpHeight));
  }

  checkJumpOnShadowCopy(tp, xPos) {
    let shadowCopy = new Enemy({
      x: xPos,
      y: this.enemy.y,
      w: this.enemy.w,
      h: this.enemy.h,
      xv: 0,
      yv: 0,
      gravityIsUsed: true
    }, this.game);

    shadowCopy.AI.targetPlatform = tp;
    shadowCopy.lastBottomCollidePlatform = this.enemy.lastBottomCollidePlatform;
    shadowCopy.AI.beforeLastBottomCollidePlatform = shadowCopy.lastBottomCollidePlatform;

    while (true) {
      shadowCopy.markForDeletion();
      shadowCopy.gravityEffect(1 / 60);
      shadowCopy.update(1 / 60);

      if (shadowCopy.lastBottomCollidePlatform === tp) {
        shadowCopy = null;
        return true;
      }
      if (shadowCopy.AI.beforeLastBottomCollidePlatform !== shadowCopy.lastBottomCollidePlatform ||
          shadowCopy.markedForDeletion) {
        shadowCopy = null;
        return false;
      }
    }
  }

  // Функция описывающая траекторию движения при прыжке
  motionEquation(x) {
    // TODO: кешировать результаты
    let t = EnemyAI.getMaxRootOfTheQuadraticEquation({
      a: this.enemy.acceleration / 2,
      b: this.enemy.startSpeed,
      c: -x
    });

    let tMaxSpeed = (this.enemy.maxSpeed - this.enemy.startSpeed) / this.enemy.acceleration;
    if ((this.enemy.startSpeed + this.enemy.acceleration * t) >= this.enemy.maxSpeed) {
      t = (x - this.enemy.startSpeed * tMaxSpeed - (this.enemy.acceleration * tMaxSpeed * tMaxSpeed) / 2) /
          this.enemy.maxSpeed + tMaxSpeed;
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

  getXForMaxJumpHeight() {
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
