const userModel = require("../../database/models/users.model");
const courseModel = require("../../database/models/courses.model");
const categoryModel = require("../../database/models/categories.model");
const { resGenerator, fileHandler } = require("../helper");
const fs = require("fs");
const path = require("path");
class Instructor {
  // register Instructor
  static registerInstructor = async (req, res) => {
    try {
      const studentData = new userModel({
        userType: "instructor",
        ...req.body,
      });
      await studentData.save();
      resGenerator(
        res,
        200,
        true,
        studentData,
        "register Instructor successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "register Instructor failed");
    }
  };

  static addCategory = async (req, res) => {
    try {
      const categoryData = new categoryModel(req.body);
      await categoryData.save();
      resGenerator(res, 200, true, categoryData, "add Category successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "add Category failed");
    }
  };

  static addCourse = async (req, res) => {
    try {
      const courseData = new courseModel({
        ...req.body,
        instructorId: req.user._id,
      });
      await courseData.save();
      resGenerator(res, 200, true, courseData, "add Category successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "add Category failed");
    }
  };
  static deleteCourse = async (req, res) => {}
  static addContent = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await courseModel
        .findById(courseId)
        .populate("categoryId");

      if (!course) {
        return resGenerator(res, 404, false, null, "Course not found");
      }
      // change path of files
      const pathVideoFile = req.files.video[0].path
        .replaceAll("\\", "/")
        .split("/")
        .slice(1)
        .join("/");
      const pathAssignment = req.files.assignment[0].path
        .replaceAll("\\", "/")
        .split("/")
        .slice(1)
        .join("/");
      // create new content
      const newContent = {
        videoFile: pathVideoFile,
        assignment: pathAssignment,
      };
      // store new content in course
      course.content.push(newContent);
      await course.save();

      resGenerator(res, 200, true, course, "Videos uploaded successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "Videos upload failed");
    }
  };

  static editContent = async (req, res) => {
    try {
      const { contentId } = req.params;
      const allCourses = await courseModel.find();

      const targetCourse = allCourses.find((course) => {
        return course.content.some((content) => content._id == contentId);
      });

      console.log("allCourses", allCourses);
      console.log("targetCourse", targetCourse);

      if (!targetCourse) {
        return resGenerator(res, 404, false, null, "Course not found");
      }

      const index = targetCourse.content.findIndex(
        (content) => content._id == contentId
      );

      // Get the paths of the old files
      const oldVideoPath = targetCourse.content[index].videoFile;
      const oldAssignmentPath = targetCourse.content[index].assignment;

      // Normalize the paths for proper comparison
      const normalizedOldVideoPath = path.normalize(oldVideoPath);
      const normalizedOldAssignmentPath = path.normalize(oldAssignmentPath);
      // Change path of files if the request include files
      const pathVideoFile =
        req.files && req.files.video && req.files.video[0]
          ? req.files.video[0].path
              .replaceAll("\\", "/")
              .split("/")
              .slice(1)
              .join("/")
          : oldVideoPath;

      const pathAssignment =
        req.files && req.files.assignment && req.files.assignment[0]
          ? req.files.assignment[0].path
              .replaceAll("\\", "/")
              .split("/")
              .slice(1)
              .join("/")
          : oldAssignmentPath;

      // Delete the old files if they have changed
      if (normalizedOldVideoPath !== pathVideoFile) {
        fs.unlink(normalizedOldVideoPath, (err) => {
          if (err) {
            console.error("Failed to delete old video file:", err);
          }
        });
      }

      if (normalizedOldAssignmentPath !== pathAssignment) {
        fs.unlink(normalizedOldAssignmentPath, (err) => {
          if (err) {
            console.error("Failed to delete old assignment file:", err);
          }
        });
      }
      // Create new content
      const newContent = {
        videoFile: pathVideoFile,
        assignment: pathAssignment,
      };

      targetCourse.content[index] = newContent;

      // Save the updated targetCourse
      await targetCourse.save();

      resGenerator(
        res,
        200,
        true,
        targetCourse,
        "Videos uploaded successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "Videos upload failed");
    }
  };


  static showCoursesByInstructor = async (req, res) => {
    try {
      const allCourses = await courseModel
        .find({ instructorId: req.user._id })
        .populate("categoryId")
        .populate("instructorId");
      resGenerator(res, 200, true, allCourses, "show all Courses successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show all Courses failed");
    }
  };
}
module.exports = Instructor;
