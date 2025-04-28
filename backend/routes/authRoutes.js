const express = require("express");
const router = express.Router();
const { checkDuplicate, isUserVerified } = require("../middleware/verifySignUp");

const { signUp, signIn, logOut, verifyUserEmail } = require("../controllers/authController");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router.route("/signup").post(checkDuplicate, signUp);

router.route("/signin").post(isUserVerified,signIn);

router.route("/emailVerification").post(verifyUserEmail)

router.route("/logout").post(logOut);

module.exports = router;
