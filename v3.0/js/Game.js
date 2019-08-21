"use strict";

import c from "./const.js"
import InputHandler from "./InputHandler.js"
import InputHandlerGameState from "./InputHandlerGameState.js"
import Hero from "./Hero.js"
import Bonus from "./Bonus.js"
import Platform from "./Platform.js"
import CrashedPlatform from "./СrashedPlatform.js"

class Game {
  constructor() {
    this.gameStates = {
      START: 0,
      RUN: 1,
      PAUSE: 2,
      DEATH: 3,
      GAMEOVER: 4
    };
    this.currentGameState = null;

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

    this.lives = 3;

    this.liveImg = new Image();
    this.deathImg = new Image();
    this.liveImg.src = "sprites/live.png";
    this.deathImg.src = "sprites/death.png";

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

    new InputHandlerGameState(this);
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

    this.currentGameState = this.gameStates.START;
  }

  update(deltaTime) {
    if (this.currentGameState === this.gameStates.START ||
        this.currentGameState === this.gameStates.PAUSE ||
        this.currentGameState === this.gameStates.GAMEOVER) {
      return;
    }

    this.totalDistance += this.screenMoveSpeed * deltaTime;
    // this.distanceScore = Math.floor(this.totalDistance / 2);   // Как половина пройденного расстояния
    this.distanceScore += 5 * deltaTime;                          // Как 5 очков в секунду

    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses, this.hero].forEach(gameObject => {
      gameObject.markForDeletion();
    });
    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses, this.hero].forEach(gameObject => {
      gameObject.screenMoving(deltaTime);
    });
    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses, this.hero].forEach(gameObject => {
      gameObject.gravityEffect(deltaTime);
    });
    [...this.crashedPlatforms, ...this.platforms, ...this.bonuses, this.hero].forEach(gameObject => {
      gameObject.update(deltaTime);
    });

    this.crashedPlatforms = this.crashedPlatforms.filter(crashedPlatform => !crashedPlatform.markedForDeletion);
    this.platforms = this.platforms.filter(platform => !platform.markedForDeletion);
    this.bonuses = this.bonuses.filter(bonus => !bonus.markedForDeletion);

    if (this.hero.markedForDeletion) {
      this.lives--;
      this.currentGameState = this.gameStates.DEATH;
    }

    if (this.lives === 0) {
      this.currentGameState = this.gameStates.GAMEOVER;
    }

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
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${Math.floor(this.distanceScore) + this.bonusScore}`, 10, 25);

    this.drawLives(ctx, this.width - 80, 10);

    switch (this.currentGameState) {
      case this.gameStates.START:
        this.drawStart(ctx);
        break;

      case this.gameStates.PAUSE:
        this.drawPause(ctx);
        break;

      case this.gameStates.DEATH:
              this.drawDeath(ctx);
              break;

      case this.gameStates.GAMEOVER:
        this.drawGameOver(ctx);
        break;
    }
  }

  drawLives(ctx, x, y, scale = 1) {
    const size = 24;

    ctx.drawImage(this.liveImg, x - size * scale / 2 - size * scale * 1.2, y, size * scale, size * scale);
    ctx.drawImage(this.liveImg, x - size * scale / 2, y, size * scale, size * scale);
    ctx.drawImage(this.deathImg, x - size * scale / 2 + size * scale * 1.2, y, size * scale, size * scale);
  }

  drawPause(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("PAUSE", this.width / 2, this.height / 2);

    ctx.font = "20px Arial";
    ctx.fillText("Press SPACEBAR to RESUME", this.width / 2, this.height / 1.6);
  }

  drawStart(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Press SPACEBAR to START", this.width / 2, this.height / 2);
  }

  drawDeath(ctx) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "100px Arial";
    ctx.fillText("Ooops!", this.width / 2, this.height / 2);

    ctx.font = "50px Arial";
    ctx.fillText("YOUR LIVES", this.width / 2, this.height / 1.5);

    this.drawLives(ctx, this.width / 2, this.height / 1.4, 3)

    ctx.font = "20px Arial";
    ctx.fillText("Press SPACEBAR to RESUME", this.width / 2, this.height / 1.1);
  }

  drawGameOver(ctx) {
    const score = Math.floor(this.distanceScore) + this.bonusScore;
    const highScore = localStorage.highscore || 0;
    if (score > highScore) {
      localStorage.setItem("highscore", score);
    }

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.font = "100px Arial";
    ctx.fillText("GAMEOVER", this.width / 2, this.height / 2);
    ctx.fillText(`Your score: ${score}`, this.width / 2, this.height / 2 + 150);

    ctx.font = "50px Arial";
    ctx.fillText(`Highscore: ${localStorage.highscore}`, this.width / 2, this.height / 2 - 200);

    ctx.font = "20px Arial";
    ctx.fillText("Press SPACEBAR to RESTART", this.width / 2, this.height / 1.1);
  }
}

export default Game
