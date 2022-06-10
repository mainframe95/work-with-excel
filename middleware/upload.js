const util = require("util");
const multer = require("multer");

// max size 2mb
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/data/input/");
  },
  filename: (req, file, cb) => {
    // console.log(file.originalname);
    // console.log('file', file)
    cb(null, file.originalname)
  },
});

let uploadFile = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).single("file");
let uploadFileMiddleware = util.promisify(uploadFile)

module.exports = uploadFileMiddleware;