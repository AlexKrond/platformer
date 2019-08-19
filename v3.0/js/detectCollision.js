function detectCollision(obj1, obj2, deltaTime) {
  if ((obj1.x + obj1.xv / deltaTime + obj1.w) <= obj2.x ||
      (obj1.y + obj1.yv / deltaTime) >= (obj2.y + obj2.h) ||
      (obj1.x + obj1.xv / deltaTime) >= (obj2.x + obj2.w) ||
      (obj1.y + obj1.yv / deltaTime + obj1.h) <= obj2.y ||
      !obj1.collides || !obj2.collides) {
    return "none";
  }

  if (+(obj1.y + obj1.h).toFixed(5) <= +obj2.y.toFixed(5)) {
    return "bottom";
  }

  if (obj1.y >= (obj2.y + obj2.h)) {
    return "top";
  }

  return "side";
}

export default detectCollision
