const userModel = require("../../database/models/users.model");
const { resGenerator, fileHandler } = require("../helper");

class Student {
  // register student
  static registerStudent = async (req, res) => {
    try {
      const studentData = new userModel(req.body);
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
}
module.exports = Student;
