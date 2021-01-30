const fs = require("fs");

const mkdir = (folderName) => {
  if (!folderName) { return false; };
  if (!fs.existsSync(folderName)){
    fs.mkdirSync(folderName);
  }
  return true;
};

module.exports = mkdir;
