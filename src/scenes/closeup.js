const JupiterView = require("../frames/jupiter");
const dateSequence = require("../dates/dateSequence")
const compileAnimation = require("../file/compileAnimation");
const mkdir = require("../file/mkdir");
const writeSVGs = require("../file/writeSVGs");

const makeTweetText = (startDate, endDate) => {
  // const start = startDate.format("dddd, MMMM Do YYYY, h:mm:ss a");
  // const end = endDate.format("h:mm:ss a");
  // return `Jupiter from ${start} to ${end} UTC+0`;
  const start = startDate.format("h:mm a");
  const end = endDate.format("h:mm a");
  return `Jupiter now, the next 5 hours (${start} - ${end} UTC+0)`;
}

const Scene = function (startDate, endDate, frames) {
  const tempDir = mkdir() + "/"; // dir must end with a "/"

  return new Promise((resolve, reject) => {
    const dates = dateSequence(startDate, endDate, frames);
    const svgs = dates.map((date, i) => JupiterView(date, i));
    writeSVGs(tempDir, svgs)
      .then(() => compileAnimation(tempDir)
        .then((filename) => resolve({
          tweet: makeTweetText(startDate, endDate),
          media: tempDir + filename,
          tmp: tempDir
        }))
        .catch(reject))
      .catch(reject);
  });
};

module.exports = Scene;
