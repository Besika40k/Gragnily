const express = require("express");
const router = express.Router();
const generateContent = require("../controllers/geminiController");
const deserializeUser = require("../middleware/deserializeUser");

router.route("/generate").post(deserializeUser, generateContent);

module.exports = router;
