const fs = require("fs");

const resGenerator = (res, statusCode, apiStatus, data, message) => {
  res.status(statusCode).send({
    apiStatus: apiStatus,
    message: message,
    data,
  });
};

const fileHandler = (req) => {
  const ext = req.file.originalname.split(".").pop();
  const newName = req.file.path + "." + ext;
  fs.renameSync(req.file.path, newName);
  return ext;
};
module.exports = { resGenerator, fileHandler };
