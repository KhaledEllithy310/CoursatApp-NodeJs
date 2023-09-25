const mongoose = require("mongoose");
const validator = require("validator");

const courseSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    content: [
      {
        videoFile: { type: String, required: true, trim: true },
        assignment: { type: String, trim: true },
      },
    ],
    image: { type: String, trim: true },
    isPublished: { type: Boolean, default: false },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "categories",
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

const courseModel = new mongoose.model("courses", courseSchema);
module.exports = courseModel;
