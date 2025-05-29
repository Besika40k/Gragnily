const express = require("express");
const router = express.Router();
const {
  searchController,
  filterSearchBooks,
  filterSearchEssays,
} = require("../controllers/searchController");

router.route("/").get(searchController);

router.route("/bookFilter").get(filterSearchBooks);

router.route("/articleFilter").get(filterSearchEssays);

module.exports = router;
