const studentsController = require("../app/controller/students.controller");
const router = require("express").Router();

router.post("/add", studentsController.addStudent);

module.exports = router;
