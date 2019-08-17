"use strict";

class Game {
  constructor(canvas) {
    this.cnv = canvas;
    this.ctx = this.cnv.getContext("2d");
  }
}

export default Game