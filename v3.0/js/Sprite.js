"use strict";

class Sprite {
  constructor(frameWidth, frameHeight, startState, gameObject, timeUpdate) {
    this.gameObject = gameObject;
    this.img = gameObject.constructor.img;

    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    this.currentState = startState;
    this.currentColumn = this.currentState.columns[0];

    this.isReversing = false;

    this.timeUpdate = timeUpdate || null;
    this.useSpeedCoefficient = !timeUpdate;
  }

  update(deltaTime) {
    if (!this.currentState) return;

    if (this.useSpeedCoefficient) {
      this.timeUpdate = Math.abs(this.gameObject.xv) * 0.08;
    }

    switch (this.currentState.type) {
      case "single":
        this.singleUpdate();
        break;

      case "cyclical":
        this.cyclicalUpdate(deltaTime);
        break;

      case "reversibleCyclical":
        this.reversibleCyclicalUpdate(deltaTime);
        break;
    }
  }

  draw(ctx, x, y) {
    ctx.drawImage(
        this.img,

        Math.floor(this.currentColumn) * this.frameWidth,
        this.currentState.row * this.frameHeight,
        this.frameWidth,
        this.frameHeight,

        x || this.gameObject.x,
        y ||this.gameObject.y,
        this.gameObject.w,
        this.gameObject.h
    );
  }

  singleUpdate() {
    this.currentColumn = this.getCurrentColumn();
  }

  cyclicalUpdate(deltaTime) {
    this.currentColumn = this.getCurrentColumn();

    this.currentColumn += this.timeUpdate * deltaTime;

    if (this.currentColumn >= this.currentState.columns[this.currentState.columns.length - 1] + 1) {
      this.currentColumn = this.currentState.columns[0];
    }
  }

  reversibleCyclicalUpdate(deltaTime) {
    this.currentColumn = this.getCurrentColumn();

    if (this.isReversing) {
      this.currentColumn -= this.timeUpdate * deltaTime;

      if (this.currentColumn < this.currentState.columns[0]) {
        this.currentColumn = this.currentState.columns[1] || this.currentState.columns[0];
        this.isReversing = false;
      }
    } else {
      this.currentColumn += this.timeUpdate * deltaTime;

      if (this.currentColumn >= this.currentState.columns[this.currentState.columns.length - 1] + 1) {
        this.currentColumn = this.currentState.columns[this.currentState.columns.length - 1];
        this.isReversing = true;
      }
    }
  }

  getCurrentColumn() {
    return (this.currentColumn >= this.currentState.columns[0] &&
        this.currentColumn < this.currentState.columns[this.currentState.columns.length - 1] + 1) ?
        this.currentColumn :
        this.currentState.columns[0];
  }
}

export default Sprite
