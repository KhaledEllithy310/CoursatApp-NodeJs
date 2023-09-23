const studentsController = require("../app/controller/students.controller");
const router = require("express").Router();

// router.get("/showAll", studentsController.showAllStudents);
router.post("/add", studentsController.registerStudent);
router.post("/edit/:id", studentsController.editProfile);
router.post("/login", studentsController.logIn);
router.post("/logout", studentsController.logOut);

module.exports = router;
