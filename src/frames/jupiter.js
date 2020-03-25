const fs = require("fs");
const SVG = require("rabbit-ear-svg");
const Jupiter = require("../render/jupiter");
const Ephemeris = require("../ephemeris/moons");
const Roto = require("../render/roto");

// the entire span of night time, for a certain city
// map of places where jupiter is visible right now

const padding = 0.1;
const absLargest = v => v.map(Math.abs).sort((a, b) => a - b).pop();

// date is a Moment.js object
const MakeFrame = function (date, frameNum) {
  const chart = Ephemeris(date);

  const w = 2.5;
  const svg = SVG(-w, -w/2, w*2, w);
  svg.background("black");
  svg.appendChild(Jupiter(date, frameNum).scale(2));

  // draw moons
  chart.map((moon, i) => Roto(`src/svg/${moon.name}.svg`, date.unix())
      .translate(moon.x, moon.y)
      .scale(moon.radius * 2))
    .forEach(g => svg.appendChild(g));

  return svg.save();
};

module.exports = MakeFrame;
