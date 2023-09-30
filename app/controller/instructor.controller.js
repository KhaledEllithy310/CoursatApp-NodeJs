const userModel = require("../../database/models/users.model");
const courseModel = require("../../database/models/courses.model");
const { resGenerator, fileHandler } = require("../helper");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
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

  //Add Course with instructor or Admin
  static addCourse = async (req, res) => {
    try {
      let instructorId;
      if (req.user.userType !== "instructor") {
        if (!req.body.instructorId) {
          throw new Error("No instructor ID provided");
        }
        instructorId = req.body.instructorId;
      } else {
        instructorId = req.user._id;
      }

      const courseData = new courseModel({
        ...req.body,
        instructorId,
      });

      if (req.file) {
        const newName = fileHandler(req);
        console.log("newName", newName);
        courseData.image =
          process.env.URL_SERVER + newName.replace("public", "");
      }
      // if (req.file) {
      //   courseData.image = req.file.filename;
      // }
      await courseData.save();
      resGenerator(res, 200, true, courseData, "add Course  successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "add Course  failed");
    }
  };

  //Edit Course with instructor or Admin
  static editCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      let instructorId;
      if (req.user.userType !== "instructor") {
        if (!req.body.instructorId) {
          throw new Error("No instructor ID provided");
        }
        instructorId = req.body.instructorId;
      } else {
        instructorId = req.user._id;
      }
      const courseData = await courseModel.findByIdAndUpdate(
        courseId,
        {
          ...req.body,
          instructorId,
        },
        { runValidators: true }
      );
      if (!courseData) throw new Error("there was no Course");
      else
        resGenerator(res, 200, true, courseData, "edit Course  successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "edit Course  failed");
    }
  };

  static showCourseById = async (req, res) => {
    try {
      const { courseId } = req.params;
      let instructorId;
      if (req.user.userType !== "instructor") {
        if (!req.body.instructorId) {
          throw new Error("No instructor ID provided");
        }
        instructorId = req.body.instructorId;
      } else {
        instructorId = req.user._id;
      }
      console.log(instructorId);
      const courseData = await courseModel.findById(courseId);
      resGenerator(res, 200, true, courseData, "show Course  successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show Course  failed");
    }
  };

  static showCourseByIdForStudents = async (req, res) => {
    try {
      const { courseId } = req.params;
      const studentId = req.user._id;

      const students = await userModel.find({
        "myLearning.courseId": courseId,
      });

      const isStudentEnrolled = students.some(
        (student) => student._id.toString() == studentId.toString()
      );

      if (isStudentEnrolled) {
        // Retrieve the course data for the given courseId
        const courseData = await courseModel
          .findById(courseId)
          .populate("instructorId")
          .populate("categoryId");

        resGenerator(res, 200, true, courseData, "Show course successfully");
      } else
        resGenerator(
          res,
          403,
          false,
          null,
          "You are not enrolled in this course"
        );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "Show course failed");
    }
  };

  //Delete Course with instructor or Admin
  static deleteCourse = async (req, res) => {
    try {
      const { courseId } = req.params;
      const course = await courseModel.findByIdAndDelete(courseId);
      // const instructorCourses = await courseModel.find({
      //   instructorId: req.user._id,
      // });
      resGenerator(res, 200, true, course, "delete course successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "delete course failed");
    }
  };

  //add content with instructor or Admin
  static addContent = async (req, res) => {
    try {
      console.log("req.files", req.files);

      const { courseId } = req.params;
      console.log(courseId);
      console.log(
        "new ObjectId(courseId.trim())",
        new ObjectId(courseId.trim())
      );
      // const course = await courseModel.findById(courseId);
      const course = await courseModel.findById(new ObjectId(courseId.trim()));

      console.log("course", course);
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
      console.log("req.body", req.body);
      // create new content
      // const newContent = {
      //   videoFile: pathVideoFile,
      //   assignment: pathAssignment,
      // };
      // console.log("newContent", newContent);
      console.log("pathAssignment", pathAssignment);
      console.log("pathVideoFile", pathVideoFile);
      const newContent = {
        video: {
          name: req.body.videoName,
          file: pathVideoFile,
        },
        assignment: {
          name: req.body.assignmentName,
          file: pathAssignment,
        },
      };
      console.log("newContent", newContent);

      // store new content in course
      course.content.push(newContent);
      await course.save();

      resGenerator(res, 200, true, course, "Videos uploaded successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "Videos upload failed");
    }
  };

  //edit content with instructor or Admin
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

      // // Normalize the paths for proper comparison
      // const normalizedOldVideoPath = path.normalize(oldVideoPath);
      // const normalizedOldAssignmentPath = path.normalize(oldAssignmentPath);
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
      console.log("pathVideoFile", pathVideoFile);
      console.log("pathAssignment", pathAssignment);
      const newContent = {
        video: {
          name: req.body.videoName,
          file: pathVideoFile,
        },
        assignment: {
          name: req.body.assignmentName,
          file: pathAssignment,
        },
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

  //show all course by instructorId with instructor or Admin
  static showCoursesByInstructor = async (req, res) => {
    try {
      let instructorId;
      if (req.user.userType !== "instructor") {
        if (!req.body.instructorId) {
          throw new Error("No instructor ID provided");
        }
        instructorId = req.body.instructorId;
      } else {
        instructorId = req.user._id;
      }
      const allCourses = await courseModel
        .find({ instructorId })
        .populate("categoryId")
        .populate("instructorId");
      resGenerator(res, 200, true, allCourses, "show all Courses successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show all Courses failed");
    }
  };

  //show all Students { paid the course} by CourseId with instructor or Admin
  static showAllStudentsByCourseId = async (req, res) => {
    try {
      const { courseId } = req.params;
      const students = await userModel.find({
        "myLearning.courseId": courseId,
      });
      resGenerator(res, 200, true, students, "show all Students successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "show all Students failed");
    }
  };
}
module.exports = Instructor;
