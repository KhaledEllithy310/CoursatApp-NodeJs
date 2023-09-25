const studentsController = require("../app/controller/students.controller");
const router = require("express").Router();
const { authAdmin, authUser } = require("../app/middleware/auth.middleware");
const upload = require("../app/middleware/upload.middleware");
// router.get("/showAll", studentsController.showAllStudents);

// register As Student
router.post("/add", studentsController.registerStudent);

module.exports = router;
