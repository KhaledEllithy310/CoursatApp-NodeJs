const mongoose = require("mongoose");
const validator = require("validator");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

const categoryModel = new mongoose.model("categories", categorySchema);
module.exports = categoryModel;
