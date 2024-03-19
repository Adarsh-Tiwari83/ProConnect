const Datauri = require("datauri/parser");
const path = require("path");

const datauri = new Datauri();

const bufferToDataURI = (file) => {
    const buffer=file.buffer;
    const type=file.originalname;
  return datauri.format(path.extname(type), buffer);
};

module.exports = bufferToDataURI;
