const moment = require("moment");
// scenes
const ElapsedTelescope = require("./scenes/elapsedTelescope");
const Closeup = require("./scenes/closeup");
const DiagramTop = require("./scenes/diagramTop");

const params = process.argv.slice(2);
const scene = (typeof params[0] === "string"
  ? parseInt(params[0])
  : 0);

const date = moment().utc();
// const date = (typeof params[1] === "string"
//   ? moment(params[1])
//   : moment.utc());

const render = () => {
  return new Promise((resolve, reject) => {
    switch (scene) {
      case 0:
        ElapsedTelescope({
          start: date,
          end: moment(date).add(12, "hours"),
          frames: 240,
          labelMoons: true,
          labelTime: true,
        }).then((...args) => resolve(...args))
          .catch(reject);
        break;
      case 1:
        Closeup({
          start: date,
          end: moment(date).add(12, "hours"),
          frames: 480,
          labelMoons: true,
          labelTime: true,
        }).then((...args) => resolve(...args))
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

