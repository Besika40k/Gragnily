const express = require("express");
const router = express.Router();
const { checkDuplicate } = require("../middleware/verifySignUp");
const { signUpVal } = require("../Validation/authValidation");
const validate = require("../middleware/validate");

const {
  signUp,
  signIn,
  logOut,
  verifyUserEmail,
  forgotPassword,
  updateUserPassword,
} = require("../controllers/authController");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.route("/signup").post(validate(signUpVal), checkDuplicate, signUp);

router.route("/signin").post(signIn);

router.route("/emailverification").get(verifyUserEmail);

router.route("/logout").post(logOut);

router.route("/forgotPassword").put(forgotPassword);

router.route("/updatePassword").put(updateUserPassword);

module.exports = router;
