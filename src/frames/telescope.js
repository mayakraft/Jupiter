const fs = require("fs");
const SVG = require("rabbit-ear-svg");
const Jupiter = require("../render/jupiter");
const Ephemeris = require("../ephemeris/moons");
const Roto = require("../render/roto");

// the entire span of night time, for a certain city
// map of places where jupiter is visible right now

const padding = 0.1;
const absLargest = v => v.map(Math.abs).sort((a, b) => a - b).pop();

// date is a Moment.js object
const MakeFrame = function (date, frameNum) {
  const chart = Ephemeris(date);
  const w = absLargest(chart.map(m => m.x)) + padding;

  const svg = SVG(-w, -w/2, w*2, w);
  svg.background("black");
  svg.appendChild(Jupiter(date, frameNum).scale(2));

  // draw moons
  chart.map((moon, i) => Roto(`src/svg/${moon.name}.svg`, date.unix())
      .translate(moon.x, moon.y)
      // .scale(moon.radius * 2))
      .scale(moon.radius * 4))
    .forEach(g => svg.appendChild(g));

  const texts = chart.map(moon => {
    const path = "./src/svg/text-" + moon.name + ".svg";
    const xmlString = fs.readFileSync(path, "utf-8");
    const temp = SVG();
    temp.load(xmlString);
    const g = SVG.g();
    Array.from(temp.childNodes).forEach(el => g.appendChild(el));
    return g;
  });

  texts.forEach((t, i) => {
    const nudge = -(chart[i].x/w)*2;
    t.setAttribute("transform", `translate(${chart[i].x+nudge} ${chart[i].y - 1 - i} scale(5)`)
    svg.appendChild(t)
  });

  // chart.map((moon, i) => svg
  //   .text(moon.name, 0, 0)//, chart[i].x, chart[i].y)
  //   .fontFamily("Times New Roman")
  //   .fontSize("20px")
  //   .fill("white")
  //   .textAnchor("middle")
  //   .setAttribute("transform", `translate(${chart[i].x} ${chart[i].y - 1} scale(0.03)`));

  return svg.save();
};

module.exports = MakeFrame;
