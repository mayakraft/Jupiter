const SVG = require("rabbit-ear-svg");
const moment = require("moment");
const Ephemeris = require("../ephemeris/moonsTop");
const svg = require("rabbit-ear-svg");

const DiagramTop = (date, options = {}) => {
  const chart = Ephemeris(date);

  const svg = SVG()
    .size(-8.5, -8.5, 17, 17)
    .background('black')
    .strokeWidth(0.15)
    .fill("none");

  const jupRad = 1;//0.75;
  const moonRadius = i => 2 + i*1.5;
  const dark = "#1a1a1a";
  svg.circle(jupRad).fill(dark);
  svg.wedge(0, 0, jupRad, 0, Math.PI).fill("white");

  // Array.from(Array(4))
  //   .map((_, i) => moonRadius(i))
  //   .map(r => svg.circle(r)
  //     .stroke("white")
  //     .strokeWidth(3)
  //     .strokeDasharray("0.001 0.79"));

  // clip path, light everywhere except right behind Jupiter
  const clip = svg.clipPath();
  const w = svg.getWidth();
  const poly = clip.polygon([w, -w], [w, w], [-w, w], [-w, -w],
    [0 - jupRad, -w], [0 - jupRad, 0], [0 + jupRad, 0], [0 + jupRad, -w])
    .fill("white");

  Array.from(Array(4))
    .map((_, i) => moonRadius(i))
    .map(r => svg.circle(r)
      .stroke("#555")
      .strokeWidth(0.02));

  const layer = svg.g();
  const moonAngles = chart.map(el => Math.atan2(el.y, el.x));

  moonAngles.map(a => [Math.cos(a), Math.sin(a)])
    .map((vec, i) => vec.map(n => n * moonRadius(i)))
    .map(p => layer.circle(p).fill(dark).radius(0.5));

  moonAngles.map(a => [Math.cos(a), Math.sin(a)])
    .map((vec, i) => vec.map(n => n * moonRadius(i)))
    .map((p, i) => layer.wedge(p[0], p[1], 0.5, 0, Math.PI)
      .fill("white")
      .clipPath(clip));

  svg.line(7.7-0.2, -7.7-0.2, 7.7-0.2, -5.6-0.2).stroke("white").strokeWidth(0.015);
  [-7.2-0.2, -6.7-0.2, -6.2-0.2, -5.7-0.2].forEach(y => svg.circle(7.7-0.2, y, 0.1).fill("white"));
  svg.arc(7.7-0.2, -8.6-0.2, 1, Math.PI/2 - 0.75, Math.PI/2 + 0.75).fill("white");
  svg.text("IO", 7.3-0.2, -7-0.2).textAnchor("end").fill("white").fontFamily("futura").fontSize(0.5);
  svg.text("EUROPA", 7.3-0.2, -6.5-0.2).textAnchor("end").fill("white").fontFamily("futura").fontSize(0.5);
  svg.text("GANYMEDE", 7.3-0.2, -6-0.2).textAnchor("end").fill("white").fontFamily("futura").fontSize(0.5);
  svg.text("CALLISTO", 7.3-0.2, -5.5-0.2).textAnchor("end").fill("white").fontFamily("futura").fontSize(0.5);

  // Earth label
  svg.text("EARTH", -6.5, 7.1)
    .fill("white")
    .fontFamily("futura")
    .fontSize(0.8);
  // arrow
  svg.line(-7, 7, -7, 7-0.6)
    .stroke("white")
    .strokeWidth(0.1);
  svg.regularPolygon(3, 0, 0, 0.25)
    .translate(-7, 7)
    .rotate(90)
    .fill("white");

  // if (options.time) {
    const time = moment(date).utc().format("h:mm a");
    svg.text(time, 7.6, 7.1)
      .fill("white")
      .fontFamily("Futura")
      .textAnchor("end")
      .fontSize(0.8);
  // } 

  return svg.save();
};

module.exports = DiagramTop;
