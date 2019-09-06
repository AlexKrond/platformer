"use strict";

class ResourceLoader {
  constructor() {
    this.cache = {};
    this.callback = null;
  }

  load(resources) {
    resources.forEach(res => {
      let resDOM;

      switch (res.type) {
        case "image":
          resDOM = new Image();
          break;
        case "sound":
          resDOM = new Audio();
      }

      this.cache[res.name] = false;

      resDOM.onload = () => {
        this.cache[res.name] = resDOM;

        if (this.isLoad() && this.callback) {
          this.callback();
        }
      };

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
      throw new Error("В качестве колбека должна быть фугкция");
    }

    if (this.isLoad()) {
      this.callback();
    }
  }

  isLoad() {
    let isLoad = true;

    for (let res in this.cache) {
      isLoad = isLoad && res;
    }

    return isLoad
  }
}

export default ResourceLoader
