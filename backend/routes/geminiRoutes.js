const express = require("express");
const router = express.Router();
const {
  generateContent,
  getHistory,
} = require("../controllers/geminiController");
const deserializeUser = require("../middleware/deserializeUser");

router.route("/generate").post(deserializeUser, generateContent);

router.route("/getHistory").get(deserializeUser, getHistory);

module.exports = router;
