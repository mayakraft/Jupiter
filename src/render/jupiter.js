// this runs readFileSync

const SVG = require("rabbit-ear-svg");
const Roto = require("./roto");
const RedSpot = require("../ephemeris/redSpot");
const Convert = require("../dates/convert");

const Jupiter = function (date, frameNum) {
  if (frameNum == null) { frameNum = date.unix(); }
  const jupiter = Roto("src/svg/jupiter-true.svg", frameNum);
  const redSpot = Roto("src/svg/red-spot.svg", frameNum);
  const transform = redSpotTransform(date)
  if (transform) {
    jupiter.appendChild(redSpot);
    redSpot.translate(transform[0], transform[1])
      .scale(transform[2], transform[2]);
  }
  return jupiter;
};

module.exports = Jupiter;

const redSpotTransform = function (date) {
  const ephemeris = RedSpot(Convert(date)) % 360;  
  const rotation = ephemeris / 180 * Math.PI;
  const scale = Math.cos(rotation);
  const x = Math.sin(rotation) * 0.46;
  const y = 0;//0.05 * scale;
  // values are translationX, translationY, scale.
  // to be applied in this order
      // .translate(x, y)
      // .scale(scale, scale)
  // counting on this angle always being positive
  return (rotation < Math.PI / 2 || rotation > Math.PI / 2 * 3)
    ? [x, y, scale]
    : undefined;
};
