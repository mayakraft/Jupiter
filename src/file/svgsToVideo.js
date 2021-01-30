const fs = require("fs");
const svg_to_png = require('svg-to-png');
const randStr = require("./randomString");
const mkdir = require("./mkdir");
const rmdir = require("./rmdir");
const tempDir = require("./tempDir");
const compileAnimation = require("./compileAnimation");

const pad = (num, size) => ('000000000' + num).substr(-size);

const writeSVGs = (svgs, directory) => new Promise((resolve, reject) => {
  let counter = 0;
  const paths = [];
  svgs.forEach((svg, i) => {
    const filename = `${pad(i, 4)}.svg`;
    const path = `${directory}${filename}`;
    fs.writeFile(path, svg, (writeError) => {
      if (writeError) { reject("fs.writeFile error", i); }
      paths.push(path);
      counter += 1;
      if (counter >= svgs.length) {
        paths.sort();
        // resolve(paths);
        resolve(directory);
      }
    });
  });
});

const SVGDirToPNGs = (svgDir, directory, options) => new Promise((resolve, reject) => {
  svg_to_png.convert(svgDir, directory, options)
    .then(() => resolve(directory))
    .catch(err => reject(err));
});

// @param {number[]} dimensions is an array of 2 numbers: width, height
const svgsToVideo = (svgs, dimensions) => {
  const pngOptions = (dimensions ? {
    defaultWidth: dimensions[0], // needs "px"?
    defaultHeight: dimensions[1],
  } : undefined);
  // make sure temp directory exists
  mkdir(tempDir);
  // make subdirectories inside tmp/ to hold svg and png files
  const svgDir = `${tempDir}${randStr()}/`;
  const pngDir = `${tempDir}${randStr()}/`;
  mkdir(svgDir);
  mkdir(pngDir);
  return new Promise((resolve, reject) => {
    writeSVGs(svgs, svgDir)
      .then(dir => SVGDirToPNGs(dir, pngDir, pngOptions))
      .then(dir => compileAnimation(dir, dimensions))
      .then(path => {
        // delete svgs, pngs, and their subdirectories
        rmdir(svgDir);
        rmdir(pngDir);
        resolve(path);
      })
      .catch(err => reject(err));
  });
};

module.exports = svgsToVideo;
