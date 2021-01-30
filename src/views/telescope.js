const fs = require("fs");
const SVG = require("rabbit-ear-svg");
const Ephemeris = require("../ephemeris/moons");
const Jupiter = require("../draw/jupiter");
const Roto = require("../draw/roto");

// @param {object} date is a Moment.js object
// @param {number} integer 0...n frame number
const MakeFrame = function (date, frameNum) {
  const chart = Ephemeris(date);
  const w = chart
    .map(el => el.x)
    .map(Math.abs)
    .sort((a, b) => a - b)
    .pop();

  const svg = SVG(-w, -w/2, w*2, w)
    .padding(0.1);
  svg.background("black");
  svg.appendChild(Jupiter(date, frameNum));

  // draw moons
  chart.map((moon, i) => Roto(`./assets/${moon.name}.svg`, {
      t: date.unix(),
      magnitude: 1,
    })
      .translate(moon.x, moon.y)
      // .scale(moon.radius * 2))
      .scale(moon.radius * 4))
    .forEach(g => svg.appendChild(g));

  chart.map((moon, i) => svg
    .text(moon.name.toUpperCase(), moon.x, moon.y - 1 - i)
    .fill("white")
    .fontFamily("Futura")
    .textAnchor("middle")
    .fontSize("0.8px"));

  return svg.save();
};

module.exports = MakeFrame;
