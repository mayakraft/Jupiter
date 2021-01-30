// this runs readFileSync
const SVG = require("rabbit-ear-svg");
const fs = require("fs");
const { noise } = require("../lib/toolkit");
const moment = require("moment");

// t is a number. a seed for our noise function
// options must have
//  .t the time
//  .magnitude the magnitude of the noise
const Image = function (path, options) {
  const xmlString = fs.readFileSync(path, "utf-8");
  const svg = SVG();
  svg.load(xmlString);

  const g = SVG.g();
  // transfer everything over. process the paths and distort them.
  Array.from(svg.childNodes)
    .filter(el => el.nodeName !== "path")
    .forEach(el => g.appendChild(el));

  const paths = Array.from(svg.childNodes)
    .filter(el => el.nodeName === "path")
    .map(el => ({d: el.getAttribute("d"), fill: el.getAttribute("fill")}))
    .map(p => SVG.path(p.d).fill(p.fill))
    .map(path => g.appendChild(path));

  const start = paths.map(p => p.get().map(el => el.values));

  paths.forEach((p,i) => {
    var mag = 0.04 * options.magnitude;
    var speed = 0.01;
    var commands = p.get();
    commands.forEach((el, j) => {
      commands[j].values = start[i][j]
        .map((n,k) => n + noise(speed*options.t + i*3 + j*0.3 + k*8) * mag)
    });
    commands.forEach(c => p.addCommand(c));
    // p.set(commands);
  });

  return g;
};

module.exports = Image;
