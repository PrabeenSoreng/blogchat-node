const User = require("../models/user");
const bcrypt = require("bcryptjs");
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

    res.status(201).json({
      message: "Signup successful!"
    });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
