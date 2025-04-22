const express = require("express");
const router = express.Router();

const {
  getAuthors,
  createAuthor,
  getAuthor,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authorsController");
const { verifyToken, isAdmin } = require("../middleware/verifyJwt");

//user
router.route("/").get(verifyToken, isAdmin, getAuthors);

router.route("/:id").get(verifyToken, isAdmin, getAuthor);

//admin
router.route("/").post(verifyToken, isAdmin, createAuthor);

router.route("/:id").put(verifyToken, isAdmin, updateAuthor);

router.route("/:id").delete(verifyToken, isAdmin, deleteAuthor);

module.exports = router;
