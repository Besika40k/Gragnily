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

//gotta do author and publisher first
// router.route("/").post(createBook)
// router.route("/:id").get(getContact)
// router.route("/:id").post(updateContact)
// router.route("/:id").delete(deleteContact)



module.exports = router;
