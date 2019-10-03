const multer = require("multer");

const fileUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "public/static/uploads"),
    filename: (req, file, cb) =>
      cb(null, `${new Date().toISOString()}_${file.originalname}`)
  })
});
module.exports = fileUpload;
