const instructorsController = require("../app/controller/instructor.controller");
const router = require("express").Router();
const { authAdmin, authUser } = require("../app/middleware/auth.middleware");
// const upload = require("../app/middleware/upload.middleware");
const uploadFiles = require("../app/middleware/uploadFiles.middleware");

// register As Instructor
router.post("/add", instructorsController.registerInstructor);
router.post("/addCategory", instructorsController.addCategory);
router.post("/addCourse", instructorsController.addCourse);
// router.post(
//   "/addContent/:courseId",
//   uploadFiles.array("videos", 2),
//   instructorsController.addContent
// );
router.post(
  "/addContent/:courseId",
  uploadFiles.fields([{ name: "video" }, { name: "assignment" }]),
  instructorsController.addContent
);
router.post(
  "/editContent/:contentId",
  uploadFiles.fields([{ name: "video" }, { name: "assignment" }]),
  instructorsController.editContent
);
router.get(
  "/showCourses",
  authUser,
  instructorsController.showCoursesByInstructor
);

module.exports = router;
