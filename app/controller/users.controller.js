const courseModel = require("../../database/models/courses.model");
const userModel = require("../../database/models/users.model");
const { resGenerator, fileHandler } = require("../helper");

class Student {
  //Login User
  static logIn = async (req, res) => {
    try {
      const userData = await userModel.logMe(req.body.email, req.body.password);
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
      let userId;
      if (req.user.userType == "admin") {
        if (!req.body.userId) {
          throw new Error("No user ID provided");
        }
        userId = req.body.userId;
      } else {
        userId = req.user._id;
      }
      // get id user from token
      const userData = await userModel.findOne({ _id: userId });
      resGenerator(res, 200, true, userData, "show user successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show user failed");
    }
  };

  // Edit Profile with auth
  static editProfile = async (req, res) => {
    try {
      let userId;
      if (req.user.userType == "admin") {
        if (!req.body.userId) {
          throw new Error("No user ID provided");
        }
        userId = req.body.userId;
      } else {
        userId = req.user._id;
      }
      // get id user from token
      const userData = await userModel.findOneAndUpdate(
        { _id: userId },
        req.body,
        { runValidators: true }
      );
      resGenerator(res, 200, true, userData, "edited user successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "edited user failed");
    }
  };

  // upload image profile with user and admin
  static uploadImage = async (req, res) => {
    try {
      console.log(req.file);
      let userId;
      if (req.user.userType == "admin") {
        if (!req.body.userId) {
          throw new Error("No user ID provided");
        }
        userId = req.body.userId;
      } else {
        userId = req.user._id;
      }
      const user = await userModel.findById(userId);
      // const ext = fileHandler(req);
      // user.image = `${req.file.filename}`;
      console.log(
        "in function uploadImage `${req.file.filename}` ",
        `${req.file.filename}`
      );
      console.log("in function uploadImage ", user.image);
      // console.log(req.file.filename);
      if (req.file) {
        const newName = fileHandler(req);
        console.log("newName", newName);
        user.image = process.env.URL_SERVER + newName.replace("public", "");
      }
      await user.save();
      console.log("in function uploadImage ", user);
      resGenerator(res, 200, true, user, "images uploaded successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "uploaded failed ");
    }
  };


}
module.exports = Student;
