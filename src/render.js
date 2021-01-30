const moment = require("moment");
// scenes
const ElapsedTelescope = require("./scenes/elapsedTelescope");
const Closeup = require("./scenes/closeup");

const params = process.argv.slice(2);
const date = (typeof params[0] === "string"
  ? moment(params[0])
  : moment.now());
const scene = (typeof params[1] === "string"
  ? parseInt(params[1])
  : 0);

const render = () => {
  return new Promise((resolve, reject) => {
    switch (scene) {
      case 0:
        ElapsedTelescope(date, moment(date).add(24, "hours"), 480)
          .then((...args) => resolve(...args))
          .catch(error => reject(error))
        break;
      case 1:
        Closeup(date, moment(date).add(24, "hours"), 480)
          .then((...args) => resolve(...args))
          .catch(error => reject(error))
        break;
      default: reject("invalid arguments"); 
        break;
    }
  });
};

// module.exports = render;

render();
