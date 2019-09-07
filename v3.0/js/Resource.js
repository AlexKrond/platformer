"use strict";

class Resource {
  constructor(name, url, type) {
    this.name = name;
    this.url = url;
    this.setType(type);
  }

  setType(type) {
    if (type === "image" || type === "sound") {
      this.type = type;
    } else {
      throw new Error("Неизвестный тип ресурса");
    }
  }
}

export default Resource
