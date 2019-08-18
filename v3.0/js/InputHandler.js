class InputHandler {
  constructor(hero) {
    this.hero = hero;

    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
  }

  // Нажатие клавиши
  keyDown(event) {
    switch (event.code) {
      case "KeyA":
      case "ArrowLeft":
        this.hero.goLeft = true;
        this.hero.goRight = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.hero.goRight = true;
        this.hero.goLeft = false;
        break;
      case "KeyW":
      case "ArrowUp":
        this.hero.jump = true;
        break;
    }
    // if (event.code === "KeyW" || event.code === "ArrowUp") {
    //   this.hero.jump = true;
    // }
  }

  // Отпускание клавиши
  keyUp(event) {
    switch (event.code) {
      case "KeyA":
      case "ArrowLeft":
        this.hero.goLeft = false;
        break;
      case "KeyD":
      case "ArrowRight":
        this.hero.goRight = false;
        break;
      case "KeyW":
      case "ArrowUp":
        this.hero.jump = false;
        break;
    }
  }
}

export default InputHandler
