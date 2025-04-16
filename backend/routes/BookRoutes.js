const express = require("express");
const router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: '/tmp/' })

const {
    getBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook
} = require("../controllers/BooksController")


router.route("/").get(getBooks)

router.route("/:id").get(getBook)

router.route("/").post(upload.fields([
    { name: 'cover_image', maxCount: 1 },
    { name: 'pdf_file', maxCount: 1 },
    { name: 'epub_file', maxCount: 1 }
  ]),createBook)

// router.route("/:id").post(updateBook)
// router.route("/:id").delete(deleteBook)



module.exports = router;
