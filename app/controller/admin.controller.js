const studentModel = require("../../database/models/students.model");
const { resGenerator } = require("../helper");

class Student {
  // create student
  static addStudent = async (req, res) => {
    try {
      const studentData = new studentModel(req.body);
      await studentData.save();
      resGenerator(res, 200, true, studentData, "added student successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "added student failed");
    }
  };

  // Edit student
  static editStudent = async (req, res) => {
    try {
      const { id } = req.params;
      const studentData = await studentModel.findOneAndUpdate(
        { _id: id },
        req.body
      );
      resGenerator(res, 200, true, studentData, "edited student successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "edited student failed");
    }
  };

  // Show All Students
  static showAllStudents = async (req, res) => {
    try {
      const allStudents = await studentModel.find();
      resGenerator(
        res,
        200,
        true,
        allStudents,
        "show all students successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show all students failed");
    }
  };

  //Login Student
  static loginStudent = async (req, res) => {
    try {
      const studentData = await studentModel.logMe(
        req.body.email,
        req.body.password
      );
      console.log(studentData);
      const token = await studentData.generateToken();
      resGenerator(
        res,
        200,
        true,
        { studentData, token },
        "login student successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "login student failed");
    }
  };

  
}
module.exports = Student;
