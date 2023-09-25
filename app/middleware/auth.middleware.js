const studentModel = require("../../database/models/users.model");
const jwt = require("jsonwebtoken");
const { resGenerator } = require("../helper");

// auth for user
const authUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT_KEY);
    const userData = await studentModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!userData) throw new Error("unauthorized");
    req.user = userData;
    req.token = token;
    next();
  } catch (e) {
    resGenerator(res, 500, false, e.message, "unauthorized");
  }
};

// auth for admin access
const authAdmin = async (req, res, next) => {
  try {
    if (!req.user.userType == "admin") throw new Error("unauthorized");
    next();
  } catch (e) {
    resGenerator(res, 500, false, e.message, "unauthorized");
  }
};

module.exports = { authUser, authAdmin };
