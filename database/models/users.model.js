const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema(
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
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
      },
    ],
    wishList: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
      },
    ],
    myLearning: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "courses" },
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

userSchema.methods.toJSON = function () {
  const data = this.toObject();
  // delete data.password;
  // delete data.__v;
  return data;
};

userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.pre("findOneAndUpdate", async function (next) {
  try {
    if (this._update.password) {
      this._update.password = await bcrypt.hash(this._update.password, 10);
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.statics.logMe = async (email, password) => {
  const userData = await userModel.findOne({ email });
  if (!userData) throw new Error("invalid email");
  const isPasswordMatched = bcrypt.compare(password, userData.password);
  if (!isPasswordMatched) throw new Error("invalid password");
  return userData;
};

userSchema.methods.generateToken = async function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
  console.log("token", token);
  this.tokens.push({ token });
  await this.save();
  return token;
};


const userModel = new mongoose.model("users", userSchema);
module.exports = userModel;
