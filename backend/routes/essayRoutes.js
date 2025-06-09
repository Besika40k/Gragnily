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
  addComment,
  deleteComment,
  getEssay,
  getUserEssays,
} = require("../controllers/essayController");

router.get("/getEssays", deserializeUser, getEssays);

router.get("/getUserEssays", deserializeUser, getUserEssays);

router.get("/getEssay/:id", deserializeUser, getEssay);

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

router.put("/addComment/:id", deserializeUser, addComment);

router.put("/removeComment/:id", deserializeUser, deleteComment);

module.exports = router;
