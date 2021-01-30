const SVG = require("rabbit-ear-svg");
const dateSequence = require("../schedule/dateSequence")
const SVGsToVideo = require("../file/svgsToVideo");
const Ephemeris = require("../ephemeris/moons");
const Jupiter = require("../draw/jupiter");
const Roto = require("../draw/roto");

const makeTweetText = (startDate, endDate) => {
  const day = startDate.format("dddd");
  const start = startDate.format("h:mm a");
  const end = endDate.format("h:mm a");
  return `Jupiter now, the next 5 hours (${start} - ${end} UTC+0)`;
};

// @param {object} date is a Moment.js object
// @param {number} integer 0...n frame number
const RealisticTelescope = (date, frameNum) => {
  const chart = Ephemeris(date);
  const w = chart
    .map(el => el.x)
    .map(Math.abs)
    .sort((a, b) => a - b)
    .pop();

  const svg = SVG(-w, -w/2, w*2, w)
    .padding(0.1);
  svg.background("black");
  svg.appendChild(Jupiter(date, frameNum, 0.15));

  // draw moons
  const options = { t: date.unix(), magnitude: 1 };
  chart.map((moon, i) => Roto(`./assets/${moon.name}.svg`, options)
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

const Scene = function (startDate, endDate, frames) {
  return new Promise((resolve, reject) => {
    const dates = dateSequence(startDate, endDate, frames);
    const svgs = dates.map((date, i) => RealisticTelescope(date, i));
    SVGsToVideo(svgs, [1200, 600])
      .then((videoPath) => resolve({
        // tweet: makeTweetText(startDate, endDate),
        media: videoPath,
      }))
      .catch(reject);
  });
};

module.exports = Scene;
