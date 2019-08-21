class InputHandlerGameState {
  constructor(game) {
    window.addEventListener("keydown", event => {
      if (event.code === "Space") {
        switch (game.currentGameState) {
          case game.gameStates.START:
            game.currentGameState = game.gameStates.RUN;
            break;

          case game.gameStates.RUN:
            game.currentGameState = game.gameStates.PAUSE;
            break;

          case game.gameStates.PAUSE:
            game.currentGameState = game.gameStates.RUN;
            break;

          case game.gameStates.GAMEOVER:
            window.location.reload();
            break;
        }
      }
    });
  }
}

export default InputHandlerGameState
