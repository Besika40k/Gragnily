const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp/" });
const deserializeUser = require("../middleware/deserializeUser");

const {
  getEssays,
  postEssay,
  editEssay,
  deleteEssay,
  likedEssay,
  favoritesEssay,
} = require("../controllers/essayController");

router.get("/getEssays", deserializeUser, getEssays);

router.post(
  "/postEssay",
  deserializeUser,
  upload.single("cover_image"),
  postEssay
);

router.put(
  "/editEssay/:id",
  deserializeUser,
  upload.single("cover_image"),
  editEssay
);

router.delete("/deleteEssay/:id", deserializeUser, deleteEssay);

router.put("/likedEssay/:id", deserializeUser, likedEssay);

router.put("/favoritesEssay/:id", deserializeUser, favoritesEssay);

module.exports = router;
