"use strict";

const c = {
  gameWidth:                 document.documentElement.clientWidth - 50,
  gameHeight:                document.documentElement.clientHeight - 50,
  // screenMoveSpeed:           30,
  screenMoveSpeed:           0,
  // bonusSpawnFrequency:       1,
  bonusSpawnFrequency:       0.007,
  // crashPlatformFrequency:    2,
  crashPlatformFrequency:    0.2,
  horizontalBraking:         10,
  acceleration:              100,
  maxSpeed:                  250,
  startSpeed:                150,
  nullifyHorizontalSpeed:    30,
  jumpForce:                 500,
  bounce:                    0.78,
  nullifyBounce:             50,
  gravity:                   500,
  hw:                        48,
  hh:                        48
};

export default c
