"use strict";

/**
 * type: single, cyclical, reversibleCyclical
 */
class SpriteState {
  constructor(columns, row, type) {
    this.columns = columns;
    this.row = row;
    this.setType(type);
  }

  setType(type) {
    switch (type) {
      case "single":
      case "cyclical":
      case "reversibleCyclical":
        this.type = type;
        break;

      default:
        throw new Error("Некорректный тип состояния спрайта");
    }
  }
}

export default SpriteState
