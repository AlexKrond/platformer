"use strict";

const c = {
  gameWidth:                 document.documentElement.clientWidth - 50,
  gameHeight:                document.documentElement.clientHeight - 50,
  screenMoveSpeed:           10,
  // bonusSpawnFrequency:       1,
  bonusSpawnFrequency:       0.007,
  // crashPlatformFrequency:    2,
  crashPlatformFrequency:    0.2,
  acceleration:              5,
  maxSpeed:                  100,
  startSpeed:                40,
  jumpForce:                 150,
  bounce:                    0.78,
  nullifyBounce:             20,
  gravity:                   3,
  hw:                        48,
  hh:                        48
};

export default c
