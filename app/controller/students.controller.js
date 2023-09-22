const studentModel = require("../../database/models/students.model");
const { resGenerator } = require("../helper");

class Student {
  static addStudent = async (req, res) => {
    try {
      const studentData = new studentModel(req.body);
      await studentData.save();
      resGenerator(res, 200, true, studentData, "added student successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "added student failed");
    }
  };

  static editStudent = async (req, res) => {
    try {
      const studentData = await studentModel.findOneAndUpdate(req.body);
      resGenerator(res, 200, true, studentData, "edited student successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "edited student failed");
    }
  };
}
module.exports = Student;
