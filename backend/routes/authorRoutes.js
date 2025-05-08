const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "/tmp/" });
const validate = require("../middleware/validate");
const { createVal } = require("../Validation/authorValidation");

const {
  getAuthors,
  createAuthor,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");
const { isAdmin } = require("../middleware/verifyJwt");
const deserializeUser = require("../middleware/deserializeUser");

//user
router.route("/").get(deserializeUser, isAdmin, getAuthors);

router.route("/:id").get(getAuthor);

//admin
router
  .route("/")
  .post(
    upload.single("cover_image"),
    deserializeUser,
    isAdmin,
    validate(createVal),
    createAuthor
  );

router.route("/:id").put(deserializeUser, isAdmin, updateAuthor);

router.route("/:id").delete(deserializeUser, isAdmin, deleteAuthor);

module.exports = router;
