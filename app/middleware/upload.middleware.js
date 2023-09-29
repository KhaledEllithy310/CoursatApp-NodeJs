// const multer = require("multer");
// const upload = multer({ dest: "public/" });
// module.exports = upload;

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  // filename: function (req, file, cb) {
  //   const ext = file.originalname.split(".").pop();
  //   cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  // },
});

const upload = multer({ storage: storage });
module.exports = upload;

// const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/");
//   },
//   filename: function (req, file, cb) {
//     const ext = file.originalname.split(".").pop();
//     cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
//     console.log("in upload", `${file.fieldname}-${Date.now()}.${ext}`);
//   },
// });

// const upload = multer({ storage: storage });
// module.exports = upload;
