"use strict";

class Sprite {
  constructor(props, gameObject) {
    this.gameObject = gameObject;

    this.img = gameObject.constructor.img;
    this.frameWidth = props.frameWidth;
    this.frameHeight = props.frameHeight;

    this.currentIndex = 0;

    this.states = {
      moveRight: [0, 1],
      standRight: [2],
      jumpRight: [3],
      jumpLeft: [4],
      standLeft: [5],
      moveLeft: [5, 6, 7, 8]
    };

    this.currentState = this.states.standRight;
  }

  update(deltaTime) {
    if (this.gameObject.xv < 0) {
      this.currentState = this.states.moveLeft;
      this.currentIndex = (this.currentIndex >= this.currentState[0] &&
          this.currentIndex < this.currentState[this.currentState.length - 1] + 1) ?
          this.currentIndex :
          this.currentState[0];
    }

    if (this.gameObject.xv > 0) {
      this.currentState = this.states.moveRight;
      this.currentIndex = (this.currentIndex >= this.currentState[0] &&
          this.currentIndex < this.currentState[this.currentState.length - 1] + 1) ?
          this.currentIndex :
          this.currentState[0];
    }

    if (this.gameObject.xv === 0) {
      if (this.currentState === this.states.moveLeft ||
          this.currentState === this.states.jumpLeft ||
          this.currentState === this.states.standLeft) {
        this.currentState = this.states.standLeft;
      }

      if (this.currentState === this.states.moveRight ||
          this.currentState === this.states.jumpRight ||
          this.currentState === this.states.standRight) {
        this.currentState = this.states.standRight;
      }

      this.currentIndex = this.currentState[0];
    }

    if (this.gameObject.yv > 10) {
      if (this.currentState === this.states.moveLeft || this.currentState === this.states.standLeft) {
        this.currentState = this.states.jumpLeft;
      }

      if (this.currentState === this.states.moveRight || this.currentState === this.states.standRight) {
        this.currentState = this.states.jumpRight;
      }

      this.currentIndex = this.currentState[0];
    }

    this.currentIndex += Math.abs(this.gameObject.xv) * 0.3 * deltaTime;
    if (this.currentState &&
        this.currentIndex >= this.currentState[this.currentState.length - 1] + 1) {
      this.currentIndex = this.currentState[0];
    }
  }

  draw(ctx) {

    ctx.drawImage(
        this.img,

        Math.floor(this.currentIndex) * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,

        this.gameObject.x,
        this.gameObject.y,
        this.gameObject.w,
        this.gameObject.h
    );
  }
}

export default Sprite
