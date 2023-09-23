const studentsController = require("../app/controller/students.controller");
const router = require("express").Router();
const { authAdmin, authUser } = require("../app/middleware/auth.middleware");
// router.get("/showAll", studentsController.showAllStudents);
// register user
router.post("/add", studentsController.registerStudent);
// login user
router.post("/login", studentsController.logIn);
// log out with authentication for users
router.post("/logout", authUser, studentsController.logOut);
// log out from all devises with authentication for users
router.post("/logOutAll", authUser, studentsController.logOutAll);


// edit profile user with authentication for users
router.post("/edit", authUser, studentsController.editProfile);
module.exports = router;
