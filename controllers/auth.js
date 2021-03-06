const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/env");
const { validationResult } = require("express-validator/check");

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const hashPwd = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      email,
      password: hashPwd
    });
    await user.save();
    const token = jwt.sign(
      { username: user.username, email: user.email },
      config.JSON_SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({
      message: "Signup successful!",
      token
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  try {
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed!");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Wrong Credentials!");
      error.statusCode = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Wrong Credentials!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        user: user.username,
        userId: user._id.toString()
      },
      "secret",
      { expiresIn: "1h" }
    );
    res.status(200).json({
      message: "Login successful!",
      token
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
