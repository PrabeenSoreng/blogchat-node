const express = require("express");
const { body } = require("express-validator/check");
const authController = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.post(
  "/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then(userDoc => {
          if (userDoc) return Promise.reject("Username already exists!");
        });
      }),
    body("email")
      .isEmail()
      .withMessage("Please enter valid Email.")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) return Promise.reject("Email already exists!");
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
  ],
  authController.signup
);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter valid Email.")
      .normalizeEmail()
  ],
  authController.login
);

module.exports = router;
