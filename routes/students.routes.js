const studentsController = require("../app/controller/students.controller");
const router = require("express").Router();
const { authAdmin, authUser } = require("../app/middleware/auth.middleware");
const upload = require("../app/middleware/upload.middleware");
// router.get("/showAll", studentsController.showAllStudents);

// register As Student
router.post("/add", studentsController.registerStudent);
// add course to cart
router.post("/addToCart/:courseId", authUser, studentsController.addToCart);
// Delete Course from Cart
router.delete(
  "/deleteFromCart/:courseId",
  authUser,
  studentsController.deleteFromCart
);

// add course to WishList
router.post(
  "/addToWishList/:courseId",
  authUser,
  studentsController.addToWishList
);

// Delete Course from WishList
router.delete(
  "/deleteFromWishList/:courseId",
  authUser,
  studentsController.deleteFromWishList
);

// add course to MyLearning
router.post(
  "/addToMyLearning/:courseId",
  authUser,
  studentsController.addToMyLearning
);

module.exports = router;
