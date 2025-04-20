const express = require("express");
const router = express.Router();

const verifySignUp = require("../middleware/verifySignUp");
const { signUp, signIn } = require("../controllers/authController");

router.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

router
  .route("/signUp")
  .post([verifySignUp.checkDuplicate, verifySignUp.checkRolesExisted], signUp);
router.route("/signIn").post(signIn);

module.exports = router;
