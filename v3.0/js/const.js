"use strict";

const c = {
  gameWidth:                 document.documentElement.clientWidth,
  gameHeight:                document.documentElement.clientHeight,
  screenMoveSpeed:           30,
  // screenMoveSpeed:           0,
  // bonusSpawnFrequency:       1,
  coinSpawnFrequency:       0.007,
  aidKitSpawnFrequency:       0.0006,
  // crashPlatformFrequency:    2,
  crashPlatformFrequency:    0.0,
  horizontalBraking:         10,
  acceleration:              100,
  maxSpeed:                  250,
  startSpeed:                150,
  nullifyHorizontalSpeed:    30,
  jumpForce:                 500,
  bounce:                    0.78,
  nullifyBounce:             50,
  gravity:                   500,
  hw:                        64,
  hh:                        64
};

export default c
