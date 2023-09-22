const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    userType: {
      type: String,
      trim: true,
      enum: ["instructor", "admin", "student"],
      default: "instructor",
    },
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Please enter a valid email");
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      match: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
      enum: ["male", "female"],
    },
    birthOfDate: {
      type: String,
      trim: true,
      required: true,
      max: "2020-01-01",
      min: "1950-1-1",
    },
    image: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const userModel = new mongoose.model("users", userSchema);
module.exports = userModel;
