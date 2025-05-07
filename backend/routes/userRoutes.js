const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp/" });
const { isAdmin } = require("../middleware/verifyJwt");
const deserializeUser = require("../middleware/deserializeUser");

const {
  getUsers,
  getUserLite,
  updateUserProfile,
  updateUserTextFields,
  deleteUser,
  requestPasswordChange,
  updateUserPassword,
} = require("../controllers/usersController");

//user
router.route("/").get(deserializeUser, isAdmin, getUsers);

router.route("/getuser").get(deserializeUser, getUserLite);

router
  .route("/updateuserprofile")
  .put(
    deserializeUser,
    upload.fields([{ name: "new_profile", maxCount: 1 }]),
    updateUserProfile
  );

router
  .route("/requestPasswordChange")
  .put(deserializeUser, requestPasswordChange);

router.route("/updateuserpassword").put(deserializeUser, updateUserPassword);

router.route("/updateuser").put(deserializeUser, updateUserTextFields);

router.route("/deleteuser").delete(deserializeUser, deleteUser);

module.exports = router;
