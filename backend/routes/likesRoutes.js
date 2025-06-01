const {
  getLikedObjects,
  handleLikeButton,
} = require("../controllers/likesController");
const express = require("express");
const deserializeUser = require("../middleware/deserializeUser");
const router = express.Router();

router.route("/get").get(deserializeUser, getLikedObjects);

router.route("/like").post(deserializeUser, handleLikeButton);

module.exports = router;
