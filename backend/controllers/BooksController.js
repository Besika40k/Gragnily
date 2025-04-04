const asyncHandler = require('express-async-handler');
const book = require("../models/book");


const getBooks = asyncHandler(async (req, res) => {
    const books = await book.find()
    res.json({ books });
});

const getBook = asyncHandler(async (req, res) => {
    const { title, ...tail} = req.body;

    if (!title) return res.status(400).json({ message: "Title is required" })

    try {
        const foundBook = await book.find({ title });

        if (!foundBook) return res.status(404).json({ message: "Book not found" })
        
        res.status(200).json({foundBook});
    } catch (error) {
        res.status(500).json({ message: "Error on book.find", error: error.message });
    }
});


// todos!!
const createBook = asyncHandler(async (req, res) => {});
const updateBook = asyncHandler(async (req, res) => {});
const deleteBook = asyncHandler(async (req, res) => {});

module.exports = {
    getBooks,
    createBook,
    getBook,
    updateBook,
    deleteBook
};
