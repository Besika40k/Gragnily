const express = require("express");
const router = express.Router();

const {
  getAuthors,
  createAuthor,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");

router.route("/").get(getAuthors);

router.route("/").post(createAuthor);

router.route("/:id").get(getAuthor);

router.route("/:id").put(updateAuthor);

router.route("/:id").delete(deleteAuthor);

module.exports = router;
