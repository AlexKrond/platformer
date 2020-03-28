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

    // Нажатие кнопки мыши для стрельбы
    window.addEventListener("mousedown", event => gameObject.fire = true);
    window.addEventListener("mouseup", event => gameObject.fire = false);

    // Захват координат мыши
    window.addEventListener("mousemove", event => {
      gameObject.clientY = event.clientY;
      gameObject.clientX = event.clientX;
    });
  }
}

export default InputHandler
