const fs = require("fs");

const randStr = () => Math.random().toString(36).replace(/0./, '');
const makeDirectoryName = () => "./tmp/" + randStr();

const mkdir = (folderName = makeDirectoryName()) => {
  if (!fs.existsSync(folderName)){
    fs.mkdirSync(folderName);
  }
  return folderName;
};

module.exports = mkdir;
