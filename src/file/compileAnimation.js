var exec = require("child_process").exec;

// convert -delay 3 -loop 0 *.png animated.gif
// var cmd = "convert -delay 3 -loop 0 " + directory + "*.png " + directory + "animated.gif";

// var cmd = `ffmpeg -r 1 -i ${directory}jupiter-%02d.png -pix_fmt yuv420p -r 30 ${directory}animated.mp4`;

const filename = "animation.mp4";

// please make sure directory ends with a "/" !!!
const compileAnimation = (directory) => new Promise((resolve, reject) => {
  const cmd = `ffmpeg -r 30 -f image2 -s 800x400 -i ${directory}%04d.png -vcodec libx264 -crf 5  -pix_fmt yuv420p ${directory}${filename}`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) { reject() }
    else { resolve(filename); }
  });
});

module.exports = compileAnimation;
