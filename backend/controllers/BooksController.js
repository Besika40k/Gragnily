const asyncHandler = require("express-async-handler");
const book = require("../models/book");
const authors = require("../models/author");
const cloudinary = require("../config/cdConnection");
const { uploadCoverImage, uploadFile } = require("../Utils/fileUtils");

const getBooks = asyncHandler(async (req, res) => {
  const books = await book.find();
  if (book.length == 0) res.status(404).json({ message: "Books Not Found" });
  else res.status(200).json(books);
});

const getBook = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const foundBook = await book.findById(id);

    if (foundBook.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(foundBook);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error on book.find", error: error.message });
  }
});

const createBook = asyncHandler(async (req, res) => {
  //Uploaded files here
  const files = req.files;

  //Names are From BookRoutes.js
  const coverImage = files.cover_image?.[0];
  const pdfFile = files.pdf_file?.[0];
  const epubFile = files.epub_file?.[0] || "";

  let cover_image_url, pdf_url, epub_url;
  // To later delete if anything goes wrong
  let ci_public_id, pdf_public_id, epub_public_id;

  try {
    const { title, author, genre, publisher_name, publication_year, language } =
      req.body;

    const tempAuthors = await Promise.all(
      //author with single element is interpreted as element not array
      (Array.isArray(author) ? author : [author]).map(async (authorName) => {
        const doc = await authors.findOne({ name: authorName });

        if (!doc) {
          throw new Error(`Author not found: ${authorName}`);
        }
        return { author_id: doc._doc._id, name: doc._doc.name };
      })
    );

    ({ url: cover_image_url, public_id: ci_public_id } = await uploadCoverImage(
      coverImage.path
    ));

    ({ url: pdf_url, public_id: pdf_public_id } = await uploadFile(
      pdfFile.path,
      "PDF"
    ));
    ({ url: epub_url, public_id: epub_public_id } = await uploadFile(
      epubFile.path,
      "EPUB"
    ));

    const newBook = await book.create({
      title,
      author: tempAuthors,
      genre,
      publisher_name,
      publication_year,
      language,
      page_count: 3,
      cover_image_url,
      ci_public_id,
      pdf_url,
      pdf_public_id,
      epub_url,
      epub_public_id,
    });

    res.status(200).json({ message: "Book Created", book: newBook });
  } catch (error) {
    // prettier-ignore
    if (ci_public_id) await cloudinary.uploader.destroy(ci_public_id);
    if (pdf_public_id) await cloudinary.uploader.destroy(pdf_public_id);
    if (epub_public_id) await cloudinary.uploader.destroy(epub_public_id);

    await book.findByIdAndDelete(newBook._id);

    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
});

const updateBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Book ID is required" });

    // const foundBook = await book.findById(id);
    // if (!foundBook) return res.status(404).json({ message: "Book Not Found" });
    console.log(req.body);

    const updatedBook = await book.findOneAndUpdate(
      { _id: id }, // Filter
      { $set: req.body }, // Update
      { new: true } // Return the updated document
    );

    res
      .status(200)
      .json({ message: "Book updated successfully", book: updatedBook });
});

const deleteBook = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Book ID is required" });

  try {
    const foundBook = await book.findById(id);

    if (!foundBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    // prettier-ignore
    if (foundBook.ci_public_id)
      await cloudinary.uploader.destroy(foundBook.ci_public_id);
    if (foundBook.pdf_public_id)
      await cloudinary.uploader.destroy(foundBook.pdf_public_id);
    if (foundBook.epub_public_id)
      await cloudinary.uploader.destroy(foundBook.epub_public_id);

    const deletedBook = await book.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Book deleted successfully", book: deletedBook });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book", error: error.message });
  }
});

module.exports = {
  getBooks,
  createBook,
  getBook,
  updateBook,
  deleteBook,
};
