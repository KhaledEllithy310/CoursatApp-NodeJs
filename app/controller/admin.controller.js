const userModel = require("../../database/models/users.model");
const categoryModel = require("../../database/models/categories.model");
const { resGenerator } = require("../helper");
const courseModel = require("../../database/models/courses.model");

class Admin {
  // Show All Students
  static showAllStudents = async (req, res) => {
    try {
      const allStudents = await userModel.find({ userType: "student" });
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

  // Show All Instructors
  static showAllInstructors = async (req, res) => {
    try {
      const allInstructors = await userModel.find({ userType: "instructor" });
      resGenerator(
        res,
        200,
        true,
        allInstructors,
        "show all Instructors successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show all Instructors failed");
    }
  };

  // Show All Admins
  static showAllAdmins = async (req, res) => {
    try {
      const allAdmins = await userModel.find({ userType: "admin" });
      resGenerator(res, 200, true, allAdmins, "show all Admins successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show all Admins failed");
    }
  };

  //Add Category with Admin
  static addCategory = async (req, res) => {
    try {
      const categoryData = new categoryModel(req.body);
      await categoryData.save();
      resGenerator(res, 200, true, categoryData, "add Category successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "add Category failed");
    }
  };

  //Edit Category with Admin
  static editCategory = async (req, res) => {
    try {
      const { categoryId } = req.params;
      const categoryData = await categoryModel.findByIdAndUpdate(
        categoryId,
        { ...req.body },
        { runValidators: true }
      );
      if (!categoryData) throw new Error("there is no category");
      else
        resGenerator(
          res,
          200,
          true,
          categoryData,
          "edit Category successfully"
        );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "edit Category failed");
    }
  };

  // Show All Admins
  static showAllCategories = async (req, res) => {
    try {
      const allCategories = await categoryModel.find();
      resGenerator(
        res,
        200,
        true,
        allCategories,
        "show all Categories successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show all Categories failed");
    }
  };

  // Show All Admins
  // static showAllCourses = async (req, res) => {
  //   try {
  //     const allCourses = await courseModel.find();
  //     resGenerator(
  //       res,
  //       200,
  //       true,
  //       allCourses,
  //       "show all Courses  successfully"
  //     );
  //   } catch (e) {
  //     resGenerator(res, 500, false, e.message, "show all Courses  failed");
  //   }
  // };

  static showAllCoursesPublish = async (req, res) => {
    try {
      const allCourses = await courseModel.find({ isPublished: true });
      resGenerator(
        res,
        200,
        true,
        allCourses,
        "show all Courses Published  successfully"
      );
    } catch (e) {
      resGenerator(
        res,
        500,
        false,
        e.message,
        "show all Courses Published failed"
      );
    }
  };

  static showAllCoursesPending = async (req, res) => {
    try {
      const allCourses = await courseModel.find({ isPublished: false });
      resGenerator(
        res,
        200,
        true,
        allCourses,
        "show all Courses Pending successfully"
      );
    } catch (e) {
      resGenerator(
        res,
        500,
        false,
        e.message,
        "show all Courses Pending failed"
      );
    }
  };
}
module.exports = Admin;
