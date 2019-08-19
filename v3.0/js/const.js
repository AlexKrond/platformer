"use strict";

const c = {
  gameWidth:                 document.documentElement.clientWidth - 50,
  gameHeight:                document.documentElement.clientHeight - 50,
  screenMoveSpeed:           10,
  bonusSpawnFrequency:       1,
  // bonusSpawnFrequency:       0.007,
  crashPlatformFrequency:    1,
  acceleration:              5,
  maxSpeed:                  100,
  startSpeed:                40,
  jumpForce:                 150,
  bound:                     0.78,
  gravity:                   3,
  hw:                        32,
  hh:                        32
};

export default c
