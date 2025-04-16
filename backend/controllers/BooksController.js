const asyncHandler = require('express-async-handler');
const book = require("../models/book");
const authors = require("../models/author")
const cloudinary = require("../config/cdConnection");
const { uploadCoverImage, uploadFile } = require('../Utils/fileUtils');

const getBooks = asyncHandler(async (req, res) => {
    const books = await book.find()
    if(book.length == 0) res.status(404).json({message: "Book(s) Not Found"})
    else res.json({ books });
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
        const files = req.files;

        const coverImage = files.cover_image?.[0];
        const pdfFile = files.pdf_file?.[0];
        const epubFile = files.epub_file?.[0] || "";
        
        const cover_image_url = await uploadCoverImage(coverImage.path)
        const pdf_url = await uploadFile(pdfFile.path)
        const epub_url = await uploadFile(epubFile.path)

        const {title,
            author,
            genre,
            publisher_name,
            publication_year,
            language
        } = req.body;
        
        

        const tempAuthors = await Promise.all(
            (Array.isArray(author) ? author : [author]).map(async (authorName) => {
                const doc = await authors.findOne({ name: authorName });
                if (!doc) {
                    throw new Error(`Author not found: ${authorName}`);
                }
                console.log(doc);
                return { author_id: doc._doc._id, name: doc._doc.name };
            })
        );
    
        const newBook = await book.create({title,
            author: tempAuthors,
            genre,
            publisher_name,
            publication_year,
            language,
            page_count: 3,
            cover_image_url,
            pdf_url,
            epub_url})

        res.status(200).json({message: "Book Created", book: newBook})

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
