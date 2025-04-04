const asyncHandler = require('express-async-handler');
const book = require("../models/book");
const authors = require("../models/author")
const cloudinary = require("../config/cdConnection")

const getBooks = asyncHandler(async (req, res) => {
    const books = await book.find()
    res.json({ books });
});

const getBook = asyncHandler(async (req, res) => {
    const { title } = req.query;

    if (!title) return res.status(400).json({ message: "Title is required" })

    try {
        const foundBook = await book.find({ title });

        if (foundBook.length == 0) return res.status(404).json({ message: "Book not found" })
        
        res.status(200).json({foundBook});
    } catch (error) {
        res.status(500).json({ message: "Error on book.find", error: error.message });
    }
});

const createBook = asyncHandler(async (req, res) => {
    try {
        const {title,
            author,
            genre,
            publisher_name,
            publication_year,
            language,
            cover_image_url,
            pdf_url,
            epub_url
        } = req.body;
        
        const tempAuthors = await Promise.all(
            author.map(async (authorName) => {
                const doc = await authors.findOne({ name: authorName});
                console.log(doc)
                return { author_id: doc._doc._id, name: doc._doc.name };
            })
        );
    
        await book.create({title,
            author: tempAuthors,
            genre,
            publisher_name,
            publication_year,
            language,
            page_count: 3,
            cover_image_url,
            pdf_url,
            epub_url})

        res.status(200).json({message: "hell yea"})

    } catch (error) {
        throw error;
    }
});



const updateBook = asyncHandler(async (req, res) => {});
const deleteBook = asyncHandler(async (req, res) => {});

module.exports = {
    getBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook
};
