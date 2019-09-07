"use strict";

class ResourceLoader {
  constructor() {
    this.cache = {};
    this.callback = null;
  }

  load(resources) {
    resources.forEach(res => {
      this.cache[res.name] = false;
      let resDOM;

      const ready = () => {
        this.cache[res.name] = resDOM;
        if (this.isLoad() && this.callback) {
          this.callback();
        }
      };

      switch (res.type) {
        case "image":
          resDOM = new Image();
          resDOM.onload = ready;
          break;
        case "sound":
          resDOM = new Audio();
          resDOM.oncanplaythrough = ready;
      }

      resDOM.src = res.url;
    });
  }

  get(name) {
    return this.cache[name];
  }

  onLoad(callback) {
    if (callback instanceof Function) {
      this.callback = callback;
    } else {
      throw new Error("В качестве колбека должна быть функция");
    }

    if (this.isLoad()) {
      this.callback();
    }
  }

  isLoad() {
    let isLoad = true;

    for (let res in this.cache) {
      if (this.cache.hasOwnProperty(res)) {
        isLoad = isLoad && this.cache[res];
      }
    }

    return isLoad
  }
}

export default ResourceLoader
