const {
  getLikedObjects,
  addObjectToLiked,
  removeObjectFromLiked,
} = require("../controllers/likesController");
const express = require("express");
const deserializeUser = require("../middleware/deserializeUser");
const router = express.Router();

router.route("/get").get(deserializeUser, getLikedObjects);
router.route("/add").post(deserializeUser, addObjectToLiked);
router.route("/remove").post(deserializeUser, removeObjectFromLiked);

module.exports = router;
