var moment = require("moment");

// start date and end date should be Moment.js objects
const DateSequence = function (startDate, endDate, frames = 2) {
  var duration = moment.duration(endDate.diff(startDate));
  var millis = duration.as("milliseconds");
  var millisInterval = millis / frames;
  return Array.from(Array(frames + 1)) // include both start and end
    .map((_, i) => millisInterval * i)
    .map(m => moment(startDate).add(m, "milliseconds"));
};

module.exports = DateSequence;
