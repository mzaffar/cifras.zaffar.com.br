const fs = require("fs");

const checkIfFolderIsEmpty = (folderPath) => {
  return new Promise((resolve, reject) => {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        return reject(err);
      }
      resolve(files.length === 0);
    });
  });
};

module.exports = {
  checkIfFolderIsEmpty,
};
