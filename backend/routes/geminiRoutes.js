const express = require("express");
const router = express.Router();
const {
  generateContent,
  getHistory,
  loadData,
} = require("../controllers/geminiController");
const deserializeUser = require("../middleware/deserializeUser");
const validate = require("../middleware/validate");
const { ragValidation } = require("../Validation/RagDataValidation");

router.route("/generate").post(deserializeUser, generateContent);

router.route("/getHistory").get(deserializeUser, getHistory);

router
  .route("/loadData")
  .post(deserializeUser, validate(ragValidation), loadData);

module.exports = router;
