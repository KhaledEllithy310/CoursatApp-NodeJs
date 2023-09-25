const usersController = require("../app/controller/users.controller");
const instructorsController = require("../app/controller/instructor.controller");
const router = require("express").Router();
const { authAdmin, authUser } = require("../app/middleware/auth.middleware");
const upload = require("../app/middleware/upload.middleware");

// login user
router.post("/login", usersController.logIn);
// log out with authentication for users
router.post("/logout", authUser, usersController.logOut);
// log out from all devises with authentication for users
router.post("/logOutAll", authUser, usersController.logOutAll);

// show profile user with authentication for users
router.get("/showProfile", authUser, usersController.showProfile);
// edit profile user with authentication for users
router.patch("/edit", authUser, usersController.editProfile);
// change image profile user with authentication for users
router.post(
  "/uploadImage",
  authUser,
  upload.single("image"),
  usersController.uploadImage
);

module.exports = router;
