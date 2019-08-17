"use strict";

import GameObject from "./GameObject.js";
import c from "./const.js"

class Hero extends GameObject {
  #acceleration = c.acceleration;
  #startSpeed = c.startSpeed;
  #maxSpeed = c.maxSpeed;
  #jumpForce = c.jumpForce;

  constructor(props) {
    super(props);
    this.jump = props.jump || false;
    this.goLeft = props.goLeft || false;
    this.goRight = props.goRight || false;
  }
}

export default Hero
