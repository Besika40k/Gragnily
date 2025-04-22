const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp/" });
const { verifyToken, isAdmin } = require("../middleware/verifyJwt");

const {
  getBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
} = require("../controllers/BooksController");

//user
router.route("/").get(getBooks);

router.route("/:id").get(getBook);

//admin
router.route("/").post(
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "pdf_file", maxCount: 1 },
    { name: "epub_file", maxCount: 1 },
  ]),
  verifyToken,
  isAdmin,
  createBook
);

router.route("/:id").put(verifyToken, isAdmin, updateBook);

router.route("/:id").delete(verifyToken, isAdmin, deleteBook);

module.exports = router;
