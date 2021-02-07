const moment = require("moment");
const dateSequence = require("../schedule/dateSequence")
const SVGsToVideo = require("../file/svgsToVideo");
const Ephemeris = require("../ephemeris/moons");
const DiagramTop = require("../draw/diagramTop");

const makeTweetText = (startDate, endDate) => {
  const day = moment(startDate).utc().format("dddd");
  const start = moment(startDate).utc().format("h:mm a");
  const end = moment(endDate).utc().format("h:mm a");
  const hours = moment.duration(moment(endDate).diff(moment(startDate))).asHours();
  return `Jupiter, view of its north pole, ${hours} hours (${start} - ${end} UTC+0)`;
  // return `Jupiter, Friday February 5, for 24 hours (UTC)`;
};

const Scene = (startDate, endDate, frames) => {
  const dates = dateSequence(startDate, endDate, frames);
  const max = dates
    .map(date => Ephemeris(date, { time: true })
      .map(el => el.x)
      .map(Math.abs)
      .sort((a, b) => a - b)
      .pop())
    .sort((a, b) => a - b)
    .pop();

  return new Promise((resolve, reject) => {
    const svgs = dates.map(date => DiagramTop(date));
    SVGsToVideo(svgs, [800, 800])
      .then((videoPath) => resolve({
        text: makeTweetText(startDate, endDate),
        media: videoPath,
      }))
      .catch(reject);
  });
};

module.exports = Scene;
