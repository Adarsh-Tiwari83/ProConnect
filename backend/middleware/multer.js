const multer = require("multer");



const storage = multer.memoryStorage();

const upload = multer({ storage: storage }).single("uploaded_file");



module.exports = upload;
