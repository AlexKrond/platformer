"use strict";

const c = {
  gameWidth:          document.documentElement.clientWidth - 50,
  gameHeight:         document.documentElement.clientHeight - 50,
  screenMoveSpeed:    5,
  platformsNum:       40,
  crashFrequency:     1,
  acceleration:       5,
  maxSpeed:           100,
  startSpeed:         40,
  jumpForce:          15,
  bound:              0.78,
  gravity:            0,//3,
  hw:                 32,
  hh:                 32
};

export default c
