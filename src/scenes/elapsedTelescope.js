const moment = require("moment");
const dateSequence = require("../schedule/dateSequence")
const SVGsToVideo = require("../file/svgsToVideo");
const Ephemeris = require("../ephemeris/moons");
const RealisticTelescope = require("../draw/realisticTelescope");

const makeTweetText = (startDate, endDate) => {
  const day = startDate.format("dddd");
  const start = startDate.format("h:mm a");
  const end = endDate.format("h:mm a");
  const month = startDate.format("MMMM");
  const monthDay = startDate.format("DD");
  const hours = moment.duration(endDate.diff(startDate)).asHours();
  return `Jupiter, view from Earth, the next ${hours} hours (${start} - ${end} UTC)`;
  // return `Jupiter, view from Earth, ${day} ${month} ${monthDay}, for 24 hours (UTC)`;
};

const Scene = function ({ start, end, frames }) {
  if (!frames) { frames = 240; }
  const dates = dateSequence(start, end, frames);
  const max = dates
    .map(date => Ephemeris(date)
      .map(el => el.x)
      .map(Math.abs)
      .sort((a, b) => a - b)
      .pop())
    .sort((a, b) => a - b)
    .pop();
  const viewbox = [-max, -max/2, max*2, max];

  return new Promise((resolve, reject) => {
    const svgs = dates.map(date => RealisticTelescope(date, { ...arguments[0], viewbox }));
    SVGsToVideo(svgs, [1200, 600])
      .then((videoPath) => resolve({
        text: makeTweetText(start, end),
        media: videoPath,
      }))
      .catch(reject);
  });
};

module.exports = Scene;

