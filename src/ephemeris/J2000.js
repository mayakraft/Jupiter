
const J2000DaysFromUTCTime = function (yr, mon, d, hr, min, sec) {
  const wholePart = 367*yr-Math.floor(7*(yr+Math.floor((mon+9)/12.0))/4.0)+Math.floor(275*mon/9.0)+d-730531.5;
  const fractionalPart = (hr + min/60.0 + sec/3600.0)/24.0;
  // return value units in days
  return wholePart + fractionalPart;
}

const J2000SecondsFromUTCTime = function () {
  return J2000DaysFromUTCTime(...arguments) * 86400;
}

const daysFromMoment = function (date) {
  const yr = date.get("year");
  const mon = date.get("month");
  const da = date.get("date");
  const hr = date.get("hour");
  const min = date.get("minute");
  const sec = date.get("second");
  // moment js encodes months start at 0.
  return J2000DaysFromUTCTime(yr, mon + 1, da, hr, min, sec);
};

// everything is expecting UTC time
module.exports = {
  days: J2000DaysFromUTCTime,
  seconds: J2000SecondsFromUTCTime,
  daysFromMoment: daysFromMoment,
};
