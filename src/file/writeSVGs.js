const fs = require("fs");
const svg2img = require("svg2img");

const defaultOptions = {
  "width": 800,
  "height": 400
};

function pad(num, size){ return ('000000000' + num).substr(-size); }

// make sure directory ends with a "/" !
const writeSVGs = function (directory, svgs, renderOptions = defaultOptions) {
  return new Promise((resolve, reject) => {
    // for async callback, keep track of write process
    let counter = 0;
    const filenames = [];
    // start conversion
    svgs.forEach((svg, i) => {
      svg2img(svg, renderOptions, (imgError, buffer) => {
        if (imgError) { reject("svg2img error", i); }
        const filename = `${pad(i, 4)}.png`;
        fs.writeFile(`${directory}${filename}`, buffer, (writeError) => {
          if (writeError) { reject("fs.writeFile error", i); }
          filenames.push(filename);
          counter += 1;
          if (counter >= svgs.length) {
            filenames.sort();
            resolve(filenames);
          }
        });
      });
    });
  });
};

module.exports = writeSVGs;
