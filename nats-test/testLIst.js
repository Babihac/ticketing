const { prototype } = require("events");
const { EventEmitter } = require("stream");

class Listener {
  static x = 4;
  constructor() {
    this.emitter = new EventEmitter();
    this.value = "ahoj jak se mas";
  }

  listen(event) {
    this.emitter.on(event, function () {
      console.log(this);
    });
  }

  listenArroq(event) {
    this.emitter.on(event, () => {
      console.log(this);
    });
  }

  emit(event) {
    this.emitter.emit(event);
  }
}

const listener = new Listener();

listener.listen("sranda");
listener.emit("sranda");
