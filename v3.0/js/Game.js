"use strict";

import c from "./const.js"
import InputHandler from "./InputHandler.js"
import Hero from "./Hero.js"
import Bonus from "./Bonus.js"
import Platform from "./Platform.js"
import CrashedPlatform from "./СrashedPlatform.js"

class Game {
  constructor() {
    this.width = c.gameWidth;
    this.height = c.gameHeight;

    this.screenMoveSpeed = c.screenMoveSpeed;

    this.crashPlatformFrequency = c.crashPlatformFrequency;
    this.bonusSpawnFrequency = c.bonusSpawnFrequency;
    this.bounce = c.bounce;
    this.nullifyBounce = c.nullifyBounce;
    this.gravity = c.gravity;

    this.totalDistance = 0;
    this.lastSpawnPlatformDist = 0;
    this.distanceScore = 0;
    this.bonusScore = 0;

    Hero.img.src = "sprites/lama-spritesheet.png";
    Bonus.img.src = "sprites/bonus.png";

    this.hero = new Hero({
      x: this.width / 2 - c.hw / 2,
      y: this.height - c.hh - 100,
      w: c.hw,
      h: c.hh,
      color: "red",
      gravityIsUsed: true
    }, this);

    this.bonuses = [];
    this.platforms = [];
    this.crashedPlatforms = [];

    new InputHandler(this.hero);
  }

  start() {
    this.platforms.push(

      // Левая граница
      new Platform({
        x: -50,
        y: -500,
        w: 50,
        h: this.height + 1000,
        isMoving: false
      }, this),

      // Правая граница
      new Platform({
        x: this.width,
        y: -500,
        w: 50,
        h: this.height + 1000,
        isMoving: false
      }, this),

      // Начальная платформа для игрока
      new Platform({
        // x: this.width / 2 - 100,
        x: 0,
        y: this.height - 100,
        // w: 200,
        w: this.width,
        h: 30,
        color: "black"
      }, this)
    );

    for (let i = 0; i < (this.height / 200); i++) {
      Platform.spawnNew(this, i * 200 - 100);
    }
  }

  screenMoving(deltaTime) {
    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses, this.hero].forEach(gameObject => {
      gameObject.screenMoving(deltaTime);
    });
  }

  gravityEffect(deltaTime) {
    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses, this.hero].forEach(gameObject => {
      gameObject.gravityEffect(deltaTime);
    });
  }

  update(deltaTime) {
    this.totalDistance += this.screenMoveSpeed * deltaTime;
    // this.distanceScore = Math.floor(this.totalDistance / 2);   // Как половина пройденного расстояния
    this.distanceScore += 5 * deltaTime;                          // Как 5 очков в секунду

    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses].forEach(gameObject => {
      gameObject.markForDeletion();
    });
    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses, this.hero].forEach(gameObject => {
      gameObject.update(deltaTime);
    });

    this.crashedPlatforms = this.crashedPlatforms.filter(crashedPlatform => !crashedPlatform.markedForDeletion);
    this.platforms = this.platforms.filter(platform => !platform.markedForDeletion);
    this.bonuses = this.bonuses.filter(bonus => !bonus.markedForDeletion);

    if (this.totalDistance > this.lastSpawnPlatformDist + 200) { // TODO: 200 вынести в константы или завязать на разброс в спавне
      Platform.spawnNew(this, -50);
      this.lastSpawnPlatformDist += 200;
    }

    if (Math.random() < this.bonusSpawnFrequency) { // TODO: привязать к deltaTime, чтобы спавн был одинаков при разных FPS
      this.bonuses.push(
          new Bonus({
            x: Math.random() * (this.width - this.hero.w),
            y: Math.random() * (this.height / 2 + 50) - 50,
            w: 32,
            h: 32,
            color: "gold",
            gravityIsUsed: true
          }, this)
      );
    }
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.width, this.height);

    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses, this.hero].forEach(gameObject => {
      gameObject.draw(ctx);
    });

    ctx.fillStyle = "red";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${Math.floor(this.distanceScore) + this.bonusScore}`, 10, 25);
  }
}

export default Game
