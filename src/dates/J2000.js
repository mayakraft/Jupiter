
const J2000DaysFromUTCTime = function (yr, mon, d, hr, min, sec) {
  const wholePart = 367*yr-Math.floor(7*(yr+Math.floor((mon+9)/12.0))/4.0)+Math.floor(275*mon/9.0)+d-730531.5;
  const fractionalPart = (hr + min/60.0 + sec/3600.0)/24.0;
  // return value units in days
  return wholePart + fractionalPart;
}

const J2000SecondsFromUTCTime = function () {
  return J2000DaysFromUTCTime(...arguments) * 86400;
}

// everything is expecting UTC time
module.exports = {
  days: J2000DaysFromUTCTime,
  seconds: J2000SecondsFromUTCTime
};
