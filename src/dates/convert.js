// this converts a moment date into a J2000 date

const J2000 = require("./J2000");

// moment js encodes months start at 0.
const convert = function (date) {
  const yr = date.get("year");
  const mon = date.get("month");
  const da = date.get("date");
  const hr = date.get("hour");
  const min = date.get("minute");
  const sec = date.get("second");
  return J2000.days(yr, mon + 1, da, hr, min, sec);
};

module.exports = convert;
