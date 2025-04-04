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

//todo other thing for now
// router.route("/:id").post(updateContact)
// router.route("/:id").delete(deleteContact)

module.exports = router;
