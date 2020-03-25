// this runs readFileSync
const SVG = require("rabbit-ear-svg");
const fs = require("fs");

const Image = function (path) {
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

  return g;
};

module.exports = Image;
