const instructorsController = require("../app/controller/instructor.controller");
const router = require("express").Router();
const { authAdmin, authUser } = require("../app/middleware/auth.middleware");
// const upload = require("../app/middleware/upload.middleware");
const uploadFiles = require("../app/middleware/uploadFiles.middleware");
const upload = require("../app/middleware/upload.middleware");

// register As Instructor
router.post("/add", instructorsController.registerInstructor);

//Add Course with instructor or Admin
router.post(
  "/addCourse",
  authUser,
  upload.single("image"),
  instructorsController.addCourse
);

//Edit Course with instructor or Admin
router.patch(
  "/editCourse/:courseId",
  authUser,
  instructorsController.editCourse
);

//Delete Course from courses with instructor or Admin
router.delete(
  "/deleteCourse/:courseId",
  authUser,
  instructorsController.deleteCourse
);
//Delete Course from courses with instructor or Admin
router.get(
  "/showCourseById/:courseId",
  authUser,
  instructorsController.showCourseById
);

//add content with instructor or Admin
router.post(
  "/addContent/:courseId",
  uploadFiles.fields([{ name: "video" }, { name: "assignment" }]),
  authUser,
  instructorsController.addContent
);

//edit content with instructor or Admin
router.patch(
  "/editContent/:contentId",
  uploadFiles.fields([{ name: "video" }, { name: "assignment" }]),
  authUser,
  instructorsController.editContent
);

//show all course by instructorId
router.get(
  "/showCourses",
  authUser,
  instructorsController.showCoursesByInstructor
);

//show all students paid the course
router.get(
  "/showStudents/:courseId",
  authUser,
  instructorsController.showAllStudentsByCourseId
);
module.exports = router;
