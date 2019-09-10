"use strict";

import Enemy from "./Enemy.js"

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
    this.maxJumpHeight = (this.enemy.jumpForce * this.enemy.jumpForce) / (2 * this.game.gravity);

    // Горизонтальное расстояние (при движении вправо или влево) для достижения максимальной высоты прыжка
    this.xForMaxJumpHeight = this.getXForMaxJumpHeight();

    this.targetPlatform = null;
    this.targetPlatformSide = null;

    this.beforeLastBottomCollidePlatform = this.enemy.lastBottomCollidePlatform;

    this.xPosForJumpToTheTP = null;
    this.isJumping = false;
  }

  update() {
    this.enemy.goLeft = false;
    this.enemy.goRight = false;
    // Если отсутствует последняя платформа на которую приземлялись (только отспавнились или платформа сломалась)
    // TODO: добавить обработку падения с поиском платформы для приземления
    if (!this.enemy.lastBottomCollidePlatform || this.enemy.lastBottomCollidePlatform.isCrashed === true) {
      this.enemy.jump = false;
      return;
    }

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
    if ((this.enemy.x + this.enemy.xv / this.enemy.horizontalBraking) > this.xPosForJumpToTheTP + 5) {
      this.enemy.goLeft = true;
    } else if ((this.enemy.x + this.enemy.xv / this.enemy.horizontalBraking) < this.xPosForJumpToTheTP - 5) {
      this.enemy.goRight = true;
    } else {
      this.enemy.x = this.xPosForJumpToTheTP - this.enemy.xv / this.enemy.horizontalBraking;

      if (this.enemy.xv === 0) {
        this.xPosForJumpToTheTP = null;
      }
    }
  }

  jumpToTheTargetPlatform() {
    if (this.enemy.lastBottomCollidePlatform === this.targetPlatform ||
        this.beforeLastBottomCollidePlatform !== this.enemy.lastBottomCollidePlatform ||
        (-this.targetPlatform.y + this.enemy.lastBottomCollidePlatform.y) >= this.maxJumpHeight) {
      this.targetPlatform = null;
      this.isJumping = false;
      return;
    }

    this.enemy.jump = true;

    // Фактически, прыжок произойдет только после bottom коллизии
    if (this.enemy.yv > -this.enemy.jumpForce * 0.95 && !this.isJumping) return;
    this.isJumping = true;
    this.enemy.jump = false;

    const tp = this.targetPlatform;
    const lp = this.enemy.lastBottomCollidePlatform;

    if ((tp.y > (lp.y + lp.h)) &&
        (((lp.x > tp.x) && (lp.x <= (tp.x + tp.w))) ||
            (((lp.x + lp.w) >= tp.x) && ((lp.x + lp.w) < (tp.x + tp.w))))) {

      switch (this.targetPlatformSide) {
        case "left":
          if ((this.enemy.x + this.enemy.w + this.enemy.xv / this.enemy.horizontalBraking) >= lp.x) {
            this.enemy.goLeft = true;
          }
          break;

        case "right":
          if ((this.enemy.x + this.enemy.xv / this.enemy.horizontalBraking) <= (lp.x + lp.w)) {
            this.enemy.goRight = true;
          }
          break;
      }

    } else {

      switch (this.targetPlatformSide) {

        case "left":

          if (this.enemy.x > (tp.x + tp.w -
              this.enemy.xv / this.enemy.horizontalBraking + 10)) {
            this.enemy.goLeft = true;
          } else if ((this.enemy.x + this.enemy.w + this.enemy.xv / this.enemy.horizontalBraking) <=
              (tp.x + tp.w)) {
            this.enemy.goLeft = false;
            this.enemy.jump = false;
          } else if ((this.enemy.y + this.enemy.h) < tp.y) {
            this.enemy.goLeft = true;
          } else {
            this.enemy.goLeft = false;
          }
          break;

        case "right":

          if ((this.enemy.x + this.enemy.w) < (tp.x -
              this.enemy.xv / this.enemy.horizontalBraking - 10)) {
            this.enemy.goRight = true;
          } else if ((this.enemy.x + this.enemy.xv / this.enemy.horizontalBraking) >=
              tp.x) {
            this.enemy.goRight = false;
            this.enemy.jump = false;
          } else if ((this.enemy.y + this.enemy.h) < tp.y) {
            this.enemy.goRight = true;
          } else {
            this.enemy.goRight = false;
          }
          break;
      }
    }
  }

  findTargetPlatform() {
    const plats = this.game.platforms.filter(p => (this.enemy.lastBottomCollidePlatform.y - p.y) < this.maxJumpHeight);

    let xMin = this.enemy.lastBottomCollidePlatform.x - this.enemy.w + 5;
    let xMax = this.enemy.lastBottomCollidePlatform.x + this.enemy.lastBottomCollidePlatform.w - 5;

    xMin = (xMin < 0) ? 0 : xMin;
    xMax = (xMax > this.game.width) ? this.game.width : xMax;

    switch (true) {
      case (this.enemy.x < this.game.width * 0.20):
        this.setRightTargetPlatform(plats, xMin, xMax);
        break;

      case (this.enemy.x > this.game.width * 0.80):
        this.setLeftTargetPlatform(plats, xMin, xMax);
        break;

      case ((this.enemy.x + this.enemy.w) < this.game.hero.x):
        this.setRightTargetPlatform(plats, xMin, xMax);
        break;

      case (this.enemy.x > (this.game.hero.x + this.game.hero.w)):
        this.setLeftTargetPlatform(plats, xMin, xMax);
        break;

      case ((this.enemy.x + this.enemy.w / 2) < (this.game.width / 2)):
        this.setRightTargetPlatform(plats, xMin, xMax);
        break;

      default:
        this.setLeftTargetPlatform(plats, xMin, xMax);
        break;
    }

    this.beforeLastBottomCollidePlatform = this.enemy.lastBottomCollidePlatform;
  }

  setLeftTargetPlatform(plats, xMin, xMax) {
    this.setTargetPlatform(plats, xMin, xMax, "left");
    if (!this.targetPlatform) this.setTargetPlatform(plats, xMin, xMax, "right");
  }

  setRightTargetPlatform(plats, xMin, xMax) {
    this.setTargetPlatform(plats, xMin, xMax, "right");
    if (!this.targetPlatform) this.setTargetPlatform(plats, xMin, xMax, "left");
  }

  setTargetPlatform(plats, xMin, xMax, side) {
    this.targetPlatformSide = side;
    let checkedPlats = new Map();

    const searchCheckedPlatforms = x => {
      let tmpPlats = this.getCheckedPlatforms(plats, x, side);

      tmpPlats.forEach(p => {
        if (checkedPlats.has(p)) {
          let xPositions = checkedPlats.get(p);
          xPositions.add(x);
          checkedPlats.set(p, xPositions);
        } else {
          checkedPlats.set(p, new Set([x]));
        }
      });
    };

    let step = 10;

    switch (side) {
      case "left":
        for (let x = xMin; x <= xMax; x += step) {
          searchCheckedPlatforms(x);
        }
        break;
      case "right":
        for (let x = xMax; x >= xMin; x -= step) {
          searchCheckedPlatforms(x);
        }
        break;
      default:
        throw new Error(`Неправильная сторона. side=${side}`);
    }

    checkedPlats = new Map([...checkedPlats.entries()].sort((a, b) => a[0].y - b[0].y));

    for (let p of checkedPlats) {
      if (this.targetPlatform) break;

      const plat = p[0];
      const xPositions = Array.from(p[1]);

      for (let xPos of xPositions) {
        if (this.checkJumpOnShadowCopy(plat, xPos)) {
          this.targetPlatform = plat;
          this.xPosForJumpToTheTP = xPos;
          break;
        }
      }
    }
  }

  getCheckedPlatforms(plats, xPos, side) {
    let platforms = [];

    for (let i = plats.length - 1; i >= 0; i--) {
      if (plats[i] !== this.enemy.lastBottomCollidePlatform && this.checkPlatform(plats[i], xPos, side)) {
        platforms.push(plats[i]);
      }
    }

    return platforms;
  }

  checkPlatform(p, xPos, side) {
    const lp = this.enemy.lastBottomCollidePlatform;
    const height = -p.y + lp.y;
    let x;

    switch (side) {
      case "left":
        if ((p.y > (lp.y + lp.h)) && (lp.x > p.x) && (lp.x <= (p.x + p.w))) {
          x = lp.x - p.x - 5; // TODO: -5 или отдельная проверка x > 5
        } else {
          x = xPos - (p.x + p.w);
        }
        break;

      case "right":
        if ((p.y > (lp.y + lp.h)) && ((lp.x + lp.w) >= p.x) && ((lp.x + lp.w) < (p.x + p.w))) {
          x = (p.x + p.w) - (lp.x + lp.w) - 5; // TODO: -5 или отдельная проверка x > 5
        } else {
          x = p.x - (xPos + this.enemy.w);
        }
        break;

      default:
        throw new Error(`Неправильная сторона. side=${side}`);
    }

    return (x > 0 && height < this.maxJumpHeight && p.y > 0 &&
        (p.y > (lp.y - this.motionEquation(x)) ||
            x < this.xForMaxJumpHeight));
  }

  // Проверка прыжка на целевую платформу с помощью теневой копии противника
  checkJumpOnShadowCopy(tp, xPos) {
    let shadowCopy = new Enemy({
      x: this.enemy.x,
      y: this.enemy.y,
      w: this.enemy.w,
      h: this.enemy.h,
      xv: this.enemy.xv,
      yv: this.enemy.yv,
      gravityIsUsed: true,
      canDestroyPlatform: false
    }, this.game);

    shadowCopy.AI.targetPlatform = tp;
    shadowCopy.AI.targetPlatformSide = this.targetPlatformSide;
    shadowCopy.AI.xPosForJumpToTheTP = xPos;
    shadowCopy.lastBottomCollidePlatform = this.enemy.lastBottomCollidePlatform;
    shadowCopy.AI.beforeLastBottomCollidePlatform = shadowCopy.lastBottomCollidePlatform;

    const deltaTime = 1 / 20;
    let timeForJump = 5;

    while (timeForJump > 0) {
      shadowCopy.markForDeletion();
      shadowCopy.gravityEffect(deltaTime);
      shadowCopy.AI.update();
      shadowCopy.onlySuperUpdate(deltaTime);

      if (shadowCopy.lastBottomCollidePlatform === tp) {
        shadowCopy = null;
        return true;
      }
      if (shadowCopy.AI.beforeLastBottomCollidePlatform !== shadowCopy.lastBottomCollidePlatform ||
          shadowCopy.markedForDeletion) {
        shadowCopy = null;
        return false;
      }

      timeForJump -= deltaTime;
    }

    return false;
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
