"use strict";

class Sprite {
  constructor(frameWidth, frameHeight, states, startState, gameObject) {
    this.gameObject = gameObject;
    this.img = gameObject.constructor.img;

    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;

    this.states = states;

    this.currentState = startState;
    this.currentColumn = this.currentState.columns[0];

    this.lastState = null;
    this.isReversing = false;

    this.gameObjectSpeedCoefficient = null;
  }

  update(deltaTime) {
    if (!this.currentState) return;

    this.gameObjectSpeedCoefficient = Math.abs(this.gameObject.xv) * 0.08;

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

  draw(ctx) {
    ctx.drawImage(
        this.img,

        Math.floor(this.currentColumn) * this.frameWidth,
        this.currentState.row * this.frameHeight,
        this.frameWidth,
        this.frameHeight,

        this.gameObject.x,
        this.gameObject.y,
        this.gameObject.w,
        this.gameObject.h
    );
  }

  singleUpdate() {
    this.currentColumn = this.getCurrentColumn();
  }

  cyclicalUpdate(deltaTime) {
    this.currentColumn = this.getCurrentColumn();

    this.currentColumn += this.gameObjectSpeedCoefficient * deltaTime;

    if (this.currentColumn >= this.currentState.columns[this.currentState.columns.length - 1] + 1) {
      this.currentColumn = this.currentState.columns[0];
    }
  }

  reversibleCyclicalUpdate(deltaTime) {
    this.currentColumn = this.getCurrentColumn();

    if (this.isReversing) {
      this.currentColumn -= this.gameObjectSpeedCoefficient * deltaTime;

      if (this.currentColumn < this.currentState.columns[0]) {
        this.currentColumn = this.currentState.columns[1] || this.currentState.columns[0];
        this.isReversing = false;
      }
    } else {
      this.currentColumn += this.gameObjectSpeedCoefficient * deltaTime;

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
