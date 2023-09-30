const adminController = require("../app/controller/admin.controller");
const router = require("express").Router();
const { authAdmin, authUser } = require("../app/middleware/auth.middleware");

// Show All Students
router.get("/showAllStudents", authAdmin, adminController.showAllStudents);

// Show All Instructors
router.get(
  "/showAllInstructors",
  authAdmin,
  adminController.showAllInstructors
);

// Show All Admins
router.get("/showAllAdmins", authAdmin, adminController.showAllAdmins);

//Add Category with Admin
router.post("/addCategory", authAdmin, adminController.addCategory);

//Edit Category with Admin
router.post("/editCategory/:id", authAdmin, adminController.editCategory);

//Show All Category with Admin
router.get(
  "/showAllCategories",
  authUser,
  authAdmin,
  adminController.showAllCategories
);
//Show All Courses Pending with Admin
router.get("/showAllCoursesPending", adminController.showAllCoursesPending);

//Show All Courses publish with Admin
router.get("/showAllCoursesPublish", adminController.showAllCoursesPublish);

module.exports = router;
