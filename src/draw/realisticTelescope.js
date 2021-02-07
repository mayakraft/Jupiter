const SVG = require("rabbit-ear-svg");
const moment = require("moment");
const Ephemeris = require("../ephemeris/moons");
const Jupiter = require("../draw/jupiter");
const Roto = require("../draw/roto");

const viewboxFromChart = (chart) => {
  const w = chart
    .map(el => el.x)
    .map(Math.abs)
    .sort((a, b) => a - b)
    .pop();
  return [-w, -w/2, w*2, w];
};

// @param {object} date is a Moment.js object
// @param {number} integer 0...n frame number
const RealisticTelescope = (date, options = {}) => {
  const chart = Ephemeris(date);
  const viewbox = options.viewbox ? options.viewbox : viewboxFromChart(chart);
  const svg = SVG(...viewbox)
    .padding(viewbox[3] / 10);
  svg.background("black");
  const back = svg.g();
  svg.appendChild(Jupiter(date, 0.2));
  const front = svg.g();

  // draw moons
  const moonOptions = { t: date.unix(), magnitude: 1 };
  chart.map((moon, i) => Roto(`./assets/${moon.name}.svg`, moonOptions)
      .translate(moon.x, moon.y)
      // .scale(moon.radius * 2))
      .scale(moon.radius * 4))
    .forEach((g, i) => chart[i].front
      ? front.appendChild(g)
      : back.appendChild(g));

  if (options.labels) {
    chart.map((moon, i) => svg
      .text(moon.name.toUpperCase(), moon.x, moon.y - 1 - i)
      .fill("white")
      .fontFamily("Futura")
      .textAnchor("middle")
      .fontSize("0.8px"));
  }

  if (options.time) {
    const time = moment(date).utc().format("h:mm a");
    svg.text(time, viewbox[0] + viewbox[2] / 2, viewbox[1] + viewbox[3])
      .fill("#aaa")
      .fontFamily("Futura")
      .textAnchor("middle")
      .fontSize("0.8px");
  } 

  return svg.save();
};

module.exports = RealisticTelescope;

