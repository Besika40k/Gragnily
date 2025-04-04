const express = require("express");
const router = express.Router();

const {
    getAuthors,
    createAuthor,
    getAuthor
} = require("../controllers/authorsController")


router.route("/").get(getAuthors)

router.route("/").post(createAuthor)

router.route("/:id").get(getAuthor)

//todo
// router.route("/:id").post(updateAuthor)
// router.route("/:id").delete(deleteAuthor)

module.exports = router;
