const userModel = require("../../database/models/users.model");
const { resGenerator, fileHandler } = require("../helper");

class Student {
  // register student
  static registerStudent = async (req, res) => {
    try {
      const studentData = new userModel(req.body);
      await studentData.save();
      resGenerator(
        res,
        200,
        true,
        studentData,
        "register student successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "register student failed");
    }
  };

  // add Course to Cart
  static addToCart = async (req, res) => {
    try {
      const { courseId } = req.params;
      const student = await userModel.findOne(req.user._id);
      const index = student.cart.findIndex(
        (course) => course.courseId == courseId
      );

      const IndexCourseInWishList = student.wishList.findIndex(
        (course) => course.courseId == courseId
      );
      if (index != -1) throw new Error("Course already exists");
      else {
        if (IndexCourseInWishList != -1) {
          student.wishList.splice(IndexCourseInWishList, 1);
        }
        student.cart.push({ courseId });
      }
      await student.save();
      resGenerator(res, 200, true, student, "add course to cart successfully");
    } catch (e) {
      resGenerator(res, 500, false, e.message, "add course to cart failed");
    }
  };

  // Delete Course from Cart
  static deleteFromCart = async (req, res) => {
    try {
      const { courseId } = req.params;
      const student = await userModel.findOne(req.user._id);
      const index = student.cart.findIndex(
        (course) => course.courseId == courseId
      );

      if (index != -1) student.cart.splice(index, 1);
      else throw new Error("this course does not exist");
      await student.save();
      resGenerator(
        res,
        200,
        true,
        student,
        "delete course from cart successfully"
      );
    } catch (e) {
      resGenerator(
        res,
        500,
        false,
        e.message,
        "delete course from cart failed"
      );
    }
  };

  // add Course to WishList
  static addToWishList = async (req, res) => {
    try {
      const { courseId } = req.params;
      const student = await userModel.findOne(req.user._id);
      const index = student.wishList.findIndex(
        (course) => course.courseId == courseId
      );
      if (index != -1) throw new Error("Course already exists");
      student.wishList.push({ courseId });
      await student.save();
      resGenerator(
        res,
        200,
        true,
        student,
        "add course to wishList successfully"
      );
    } catch (e) {
      resGenerator(res, 500, false, e.message, "add course to wishList failed");
    }
  };

  // Delete Course from WishList
  static deleteFromWishList = async (req, res) => {
    try {
      const { courseId } = req.params;
      const student = await userModel.findOne(req.user._id);
      const index = student.wishList.findIndex(
        (course) => course.courseId == courseId
      );

      if (index != -1) student.wishList.splice(index, 1);
      else throw new Error("this course does not exist");
      await student.save();
      resGenerator(
        res,
        200,
        true,
        student,
        "delete course from wishList successfully"
      );
    } catch (e) {
      resGenerator(
        res,
        500,
        false,
        e.message,
        "delete course from wishList failed"
      );
    }
  };

  // add Course to MyLearning
  static addToMyLearning = async (req, res) => {
    try {
      const { courseId } = req.params;
      const student = await userModel.findOne(req.user._id);
      const index = student.myLearning.findIndex(
        (course) => course.courseId == courseId
      );
      const IndexCourseInCart = student.cart.findIndex(
        (course) => course.courseId == courseId
      );
      console.log("IndexCourseInCart", IndexCourseInCart);
      if (index != -1) throw new Error("Course already exists");
      else {
        if (
          req.body.promoCode !== process.env.PROMO_CODE ||
          IndexCourseInCart === -1
        ) {
          throw new Error("Invalid promo code or course not in cart");
        } else {
          student.myLearning.push({ courseId });
          // Remove the course from the cart
          student.cart.splice(IndexCourseInCart, 1);
        }
        await student.save();
      }

      resGenerator(
        res,
        200,
        true,
        student,
        "add course to myLearning successfully"
      );
    } catch (e) {
      resGenerator(
        res,
        500,
        false,
        e.message,
        "add course to myLearning failed"
      );
    }
  };
}
module.exports = Student;
