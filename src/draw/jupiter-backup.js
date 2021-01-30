// this runs readFileSync

const SVG = require("rabbit-ear-svg");
const Roto = require("./roto");
const RedSpot = require("../ephemeris/redSpot");
const Convert = require("../dates/convert");

const Jupiter = function (date, frameNum) {
  if (frameNum == null) { frameNum = date.unix(); }
  const jupiter = Roto("./assets/jupiter-true.svg", {
    t: frameNum,
    magnitude: 0.8,
  });
  const redSpot = Roto("./assets/red-spot.svg", {
    t: frameNum * 2,
    magnitude: 0.6,
  });
  const transform = redSpotTransform(date)
  if (transform) {
    jupiter.appendChild(redSpot);
    redSpot
      .translate(transform[0], transform[1])
      .rotate(`${(transform[4]-0.5)*50}deg`)
      .scale(transform[3], 1)
      // .scale(transform[2], transform[2]);
  }
  return jupiter;
};

module.exports = Jupiter;

const redSpotTransform = function (date) {
  const ephemeris = RedSpot(Convert(date)) % 360;  
  const rotation = ephemeris / 180 * Math.PI;
  const unit = (rotation-Math.PI/2*3) < 0
    ? (rotation + Math.PI / 2) / Math.PI
    : (rotation - Math.PI / 2 * 3) / Math.PI;
  const scale = Math.cos(rotation);
  const x = Math.sin(rotation) * 0.52;
  const y = 0;//0.05 * scale;
  // counting on this angle always being positive
  return (rotation < Math.PI / 2 || rotation > Math.PI / 2 * 3)
    // ? [x, y, scale, Math.sin(unit*Math.PI)]
    ? [x, y, scale, unit < 0.5 ? unit : 1.0-unit, unit]
    : undefined;
};
