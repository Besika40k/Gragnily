const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp/" });
const deserializeUser = require("../middleware/deserializeUser");

const {
  getArticles,
  postArticle,
  editArticle,
  deleteArticle,
  likedArticle,
  favoritesArticle,
} = require("../controllers/articleController");

router.get("/getArticles", deserializeUser, getArticles);

router.post("/postArticle", deserializeUser, upload.single('cover_image'), postArticle);

router.put("/editArticle/:id", deserializeUser, upload.single('cover_image'), editArticle);

router.delete("/deleteArticle/:id", deserializeUser, deleteArticle);

router.put("/likedArticle/:id", deserializeUser, likedArticle);

router.put("/favoritesArticle/:id", deserializeUser, favoritesArticle);

module.exports = router;
