const fs = require("fs");

// please specify a "dir" string that ends with a "/"

const rmdir = function (dir) {
  if (!fs.existsSync(dir)) { return; }
  fs.readdirSync(dir).forEach(file => {
    if (fs.lstatSync(dir+file).isDirectory()) {
      rmdir(dir+file+"/");
    } else {
      fs.unlinkSync(dir+file);
    }
  });
  fs.rmdirSync(dir);
};

module.exports = rmdir;
