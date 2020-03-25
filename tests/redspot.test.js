const redSpot = require("../src/ephemeris/redSpot");
const J2000 = require("../src/dates/J2000");

// according to Sky and Telescope, red spot transit calculator
// https://skyandtelescope.org/observing/interactive-sky-watching-tools/transit-times-of-jupiters-great-red-spot/
// some transit dates and times:
const dates = [
  [2020, 3, 20, 2, 7, 0],
  [2020, 3, 20, 12, 2, 0],
  [2020, 3, 20, 21, 58, 0],
  [2019, 3, 20, 8, 57, 0],
  [2019, 3, 20, 18, 53, 0],
  [2019, 3, 21, 4, 48, 0],
  [2020, 12, 15, 5, 17, 0],
  [2020, 12, 15, 15, 13, 0],
  [2020, 12, 16, 1, 9, 0],
  [2020, 12, 15, 10, 15, 0], // this one should be 180 degrees
];

// const jdSec = J2000.seconds(...date0)

dates.forEach(date => {
  const jd = J2000.days(...date);
  const red = redSpot(jd);
  console.log(jd, red)
});
