const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp/" });
const { isAdmin } = require("../middleware/verifyJwt");
const { createVal } = require("../Validation/BookValidation");
const validate = require("../middleware/validate");

const {
  getBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
  getBooksPreview,
} = require("../controllers/BooksController");
const deserializeUser = require("../middleware/deserializeUser");

//user
router.route("/").get(deserializeUser, isAdmin, getBooks);

router.route("/search").get(getBooksPreview);

router.route("/:id").get(getBook);

//admin

router.route("/").post(
  upload.fields([
    { name: "cover_image", maxCount: 1 },
    { name: "pdf_file", maxCount: 2 },
    { name: "epub_file", maxCount: 1 },
  ]),
  deserializeUser,
  isAdmin,
  validate(createVal),
  createBook
);

router.route("/:id").put(deserializeUser, isAdmin, updateBook);

router.route("/:id").delete(deserializeUser, isAdmin, deleteBook);

module.exports = router;
