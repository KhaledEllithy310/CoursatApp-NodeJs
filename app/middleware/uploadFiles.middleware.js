// const multer = require("multer");
// const upload = multer({ dest: "public/" });
// module.exports = upload;

const multer = require("multer");

// Configure multer storage and options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/"); // Specify the destination directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

// Configure multer upload options
const upload = multer({
  storage: storage,
  // limits: {
  //   //  fileSize: 10 * 1024 * 1024, // Limit file size to 10MB
  // },
});

module.exports = upload;
