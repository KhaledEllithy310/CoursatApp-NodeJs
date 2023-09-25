const express = require("express");
const app = express();
const path = require("path");
const studentRouter = require("../routes/students.routes");
const instructorRouter = require("../routes/instructors.routes");
const userRouter = require("../routes/users.routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/users", userRouter);
app.use("/instructors", instructorRouter);
app.use("/students", studentRouter);
module.exports = app;
