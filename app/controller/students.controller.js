const studentModel = require("../../database/models/students.model");
const { resGenerator } = require("../helper");

class Student {
  // register student
  static registerStudent = async (req, res) => {
    try {
      const studentData = new studentModel(req.body);
      await studentData.save();
      resGenerator(
        res,
        200,
        true,
        studentData,
        "register student successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "register student failed");
    }
  };

  //Login User
  static logIn = async (req, res) => {
    try {
      const userData = await studentModel.logMe(
        req.body.email,
        req.body.password
      );
      const token = await userData.generateToken();
      resGenerator(
        res,
        200,
        true,
        { userData, token },
        "login user successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "login user failed");
    }
  };

  // logout User
  static logOut = async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
      await req.user.save();
      resGenerator(res, 200, true, null, "logout user successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "logout user failed");
    }
  };

  // logout User from All devices
  static logOutAll = async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();
      resGenerator(res, 200, true, null, "logOutAll user successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "logOutAll user failed");
    }
  };

  // show Profile with auth
  static showProfile = async (req, res) => {
    try {
      // get id user from token
      const userData = await studentModel.findOne({ _id: req.user.id });
      resGenerator(res, 200, true, userData, "show user successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show user failed");
    }
  };

  // Edit Profile with auth
  static editProfile = async (req, res) => {
    try {
      // get id user from token
      const userData = await studentModel.findOneAndUpdate(
        { _id: req.user.id },
        req.body
      );
      resGenerator(res, 200, true, userData, "edited user successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "edited user failed");
    }
  };

  
}
module.exports = Student;
