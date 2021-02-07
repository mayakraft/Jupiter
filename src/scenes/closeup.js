const SVG = require("rabbit-ear-svg");
const moment = require("moment");
const dateSequence = require("../schedule/dateSequence")
const SVGsToVideo = require("../file/svgsToVideo");
const Ephemeris = require("../ephemeris/moons");
const Jupiter = require("../draw/jupiter");
const Roto = require("../draw/roto");

const makeTweetText = (startDate, endDate) => {
  const day = moment(startDate).utc().format("dddd");
  const start = moment(startDate).utc().format("h:mm a");
  const end = moment(endDate).utc().format("h:mm a");
  const hours = moment.duration(moment(endDate).diff(moment(startDate))).asHours();
  // return `Jupiter (with Io, Europa, Ganymede) now for the next ${hours} hours (${start} - ${end} UTC+0)`;
  return `Jupiter now for the next ${hours} hours (${start} - ${end} UTC+0)`;
};

// @param {object} date is a Moment.js object
// @param {number} integer 0...n frame number
const TelescopeJupiter = (date, options = {}) => {
  const chart = Ephemeris(date);

  const svg = SVG(-1, -1, 2, 2)
    .padding(0.5);
  svg.background("black");
  const back = svg.g();
  svg.appendChild(Jupiter(date));
  const front = svg.g();

  // draw moons
  const moonOptions = { t: date.unix(), magnitude: 1 };
  chart.map((moon, i) => Roto(`./assets/${moon.name}.svg`, moonOptions)
      .translate(moon.x, moon.y)
      .scale(moon.radius * 2))
      // .scale(moon.radius * 4))
    .forEach((g, i) => chart[i].front
      ? front.appendChild(g)
      : back.appendChild(g));

  return svg.save();
};

const Scene = function (startDate, endDate, frames) {
  const dates = dateSequence(startDate, endDate, frames);
  return new Promise((resolve, reject) => {
    const svgs = dates.map((date, i) => TelescopeJupiter(date));
    SVGsToVideo(svgs, [800, 800])
      .then((videoPath) => resolve({
        text: makeTweetText(startDate, endDate),
        media: videoPath,
      }))
      .catch(reject);
  });
};

module.exports = Scene;

