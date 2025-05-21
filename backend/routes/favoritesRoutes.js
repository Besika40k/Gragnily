const {
  getFavoriteObjects,
  addObjectToFavorites,
  removeObjectFromFavorites,
} = require("../controllers/favoritesController");
const express = require("express");
const deserializeUser = require("../middleware/deserializeUser");
const router = express.Router();

router.route("/get").get(deserializeUser, getFavoriteObjects);
router.route("/add").post(deserializeUser, addObjectToFavorites);
router.route("/remove").post(deserializeUser, removeObjectFromFavorites);

module.exports = router;
