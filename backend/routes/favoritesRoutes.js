const {
  getFavoriteObjects,
  addObjectToFavorites,
  removeObjectFromFavorites,
} = require("../controllers/favoritesController");
const express = require("express");
const router = express.Router();

router.route("/get").get(getFavoriteObjects);
router.route("/add").post(addObjectToFavorites);
router.route("/remove").post(removeObjectFromFavorites);

module.exports = router;
