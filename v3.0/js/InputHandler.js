class InputHandler {
  constructor(gameObject) {

    // Нажатие клавиши
    window.addEventListener("keydown", event => {
      switch (event.code) {
        case "KeyA":
        case "ArrowLeft":
          gameObject.goLeft = true;
          gameObject.goRight = false;
          break;
        case "KeyD":
        case "ArrowRight":
          gameObject.goRight = true;
          gameObject.goLeft = false;
          break;
        case "KeyW":
        case "ArrowUp":
          gameObject.jump = true;
          break;
      }
      // if (event.code === "KeyW" || event.code === "ArrowUp") {
      //   gameObject.jump = true;
      // }
    });

    // Отпускание клавиши
    window.addEventListener("keyup", event => {
      switch (event.code) {
        case "KeyA":
        case "ArrowLeft":
          gameObject.goLeft = false;
          break;
        case "KeyD":
        case "ArrowRight":
          gameObject.goRight = false;
          break;
        case "KeyW":
        case "ArrowUp":
          gameObject.jump = false;
          break;
      }
    });
  }
}

export default InputHandler
