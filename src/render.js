const moment = require("moment");
// scenes
const ElapsedTelescope = require("./scenes/elapsedTelescope");
const Closeup = require("./scenes/closeup");
const DiagramTop = require("./scenes/diagramTop");

const params = process.argv.slice(2);
const scene = (typeof params[0] === "string"
  ? parseInt(params[0])
  : 0);

const date = (typeof params[1] === "string"
  ? moment(params[1])
  : moment.now());

const render = () => {
  return new Promise((resolve, reject) => {
    switch (scene) {
      case 0:
        ElapsedTelescope(date, moment(date).add(12, "hours"), 480)
          .then((...args) => resolve(...args))
          .catch(reject);
        break;
      case 1:
        Closeup(date, moment(date).add(12, "hours"), 480)
          .then((...args) => resolve(...args))
          .catch(reject);
        break;
      case 2:
        DiagramTop(date, moment(date).add(12, "hours"), 240)
          .then((...args) => resolve(...args))
          .catch(reject);
        break;
      default: reject("invalid arguments"); 
        break;
    }
  });
};

// module.exports = render;
render();
