const exec = require("child_process").exec;
const tempDir = require("./tempDir");
const randomString = require("./randomString");

// convert -delay 3 -loop 0 *.png animated.gif
// var cmd = "convert -delay 3 -loop 0 " + directory + "*.png " + directory + "animated.gif";

// var cmd = `ffmpeg -r 1 -i ${directory}jupiter-%02d.png -pix_fmt yuv420p -r 30 ${directory}animated.mp4`;

// please make sure directory ends with a "/" !!!
const compileAnimation = (directory, dimensions = [640, 480]) =>
  new Promise((resolve, reject) => {
    const path = `${tempDir}${randomString()}.mp4`
    const cmd = `ffmpeg -r 60 -f image2 -s ${dimensions.join("x")} -i ${directory}%04d.png -vcodec libx264 -crf 5  -pix_fmt yuv420p ${path}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) { reject() }
      else { resolve(path); }
    });
  });

module.exports = compileAnimation;
