const express = require("express");
const router = express.Router();

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
router.route("/").get(getAuthors);

router.route("/:id").get(getAuthor);

//admin
router.route("/").post(deserializeUser, isAdmin, createAuthor);

router.route("/:id").put(deserializeUser, isAdmin, updateAuthor);

router.route("/:id").delete(deserializeUser, isAdmin, deleteAuthor);

module.exports = router;
