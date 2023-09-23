const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const studentSchema = mongoose.Schema(
  {
    userType: {
      type: String,
      trim: true,
      enum: ["instructor", "admin", "student"],
      default: "student",
    },
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 30,
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
      min: "1950-01-01",
    },
    image: { type: String, trim: true },
    cart: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
      },
    ],
    wishList: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
      },
    ],
    myLearning: [
      {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

studentSchema.methods.toJSON = function () {
  const data = this.toObject();
  // delete data.password;
  // delete data.__v;
  return data;
};

studentSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
});

studentSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this._update.password) {
      this._update.password = await bcrypt.hash(this._update.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

studentSchema.statics.logMe = async (email, password) => {
  const studentData = await studentModel.findOne({ email });
  if (!studentData) throw new Error("invalid email");
  const isPasswordMatched = bcrypt.compare(password, studentData.password);
  if (!isPasswordMatched) throw new Error("invalid password");
  return studentData;
};

studentSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
  console.log("token", token);
  this.tokens.push({ token });
  await this.save();
  return token;
};

const studentModel = new mongoose.model("Students", studentSchema);
module.exports = studentModel;
