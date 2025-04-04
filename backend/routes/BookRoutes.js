const express = require("express");
const router = express.Router();

const {
    getBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook
} = require("../controllers/BooksController")




router.route("/").get(getBooks)

router.route("/:id").get(getBook)

router.route("/").post(createBook)

// router.route("/:id").post(updateBook)
// router.route("/:id").delete(deleteBook)



module.exports = router;
