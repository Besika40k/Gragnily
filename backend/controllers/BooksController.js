const asyncHandler = require("express-async-handler");
const book = require("../models/book");
const authors = require("../models/author");
const {
  uploadCoverImage,
  uploadFile,
  deleteCloudinaryFile,
  deleteStorageFile,
} = require("../Utils/fileUtils");
const pdf = require("pdf-parse");
const like = require("../models/likes");
const fs = require("fs").promises;

const getBooks = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get all Books'*/
  const books = await book.find();

  if (book.length == 0) res.status(404).json({ message: "Books Not Found" });
  else res.status(200).json(books);
});

const getBook = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get a book by ID' */
  const { id } = req.params;

  let liked = false;

  const foundBook = await book
    .findById(id)
    .select("-ci_public_id -epub_public_id -pdf_public_id");

  if (req.userId) {
    liked = (await like.findOne({ _id: req.userId, ["books"]: id }))
      ? true
      : false;
  }

  if (foundBook.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json({ book: foundBook, liked });
});

const createBook = asyncHandler(async (req, res) => {
  /*
    #swagger.summary = "Create a new book"
    #swagger.description = "Uploads a book with a cover image, one or two PDFs, and an optional EPUB file. Supports multilingual fields."
    #swagger.consumes = ['multipart/form-data']
    #swagger.requestBody = {
      required: true,
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              author: {
                type: "array",
                items: { type: "string" },
                description: "Array of author IDs"
              },
              genre: {
                type: "array",
                items: { type: "string" }
              },
              
              description: { type: "string" },
              publisher_name: { type: "string" },
              publication_year: {
                type: "integer",
                example: 2023
              },
              language: { type: "string" },
              subject: { type: "string" },
              cover_image: {
                type: "string",
                format: "binary"
              },
              pdf_file: {
                type: "array",
                items: {
                  type: "string",
                  format: "binary"
                },
                description: "At least one PDF file required; a second one is optional"
              },
              epub_file: {
                type: "string",
                format: "binary"
              }
            },
            required: [
              "title",
              "author",
              "genre",
              "language",
              "cover_image",
              "pdf_file"
            ]
          }
        }
      }
    }
  */

  //Uploaded files here
  const files = req.files;

  //Names are From BookRoutes.js
  const coverImage = files.cover_image?.[0];
  const pdfFile1 = files.pdf_file?.[0];
  const pdfFile2 = files.pdf_file?.[1];
  const epubFile = files.epub_file?.[0] || "";

  let newBook;

  let cover_image_url,
    pdf_url = [],
    epub_url;
  // To later delete if anything goes wrong
  let ci_public_id,
    pdf_public_id = [],
    epub_public_id;
  let page_count;

  try {
    let {
      title,
      author,
      genre,
      publisher_name,
      publication_year,
      description,
      language,
      subject,
    } = req.body;

    if (pdfFile1) {
      try {
        const pdfBuffer = await fs.readFile(pdfFile1.path);
        const pdfData = await pdf(pdfBuffer);
        page_count = pdfData.numpages;
      } catch (error) {
        console.error("PDF processing failed:", error);
      }
    }

    const tempAuthors = await Promise.all(
      // Ensure `author` is an array (handle single ID case)
      (Array.isArray(author) ? author : [author]).map(async (authorId) => {
        const doc = await authors.findById(authorId);
        if (!doc) {
          throw new Error(`Author not found: ${authorId}`);
        }

        return { author_id: doc._id };
      })
    );

    ({ url: cover_image_url, public_id: ci_public_id } = await uploadCoverImage(
      coverImage.path,
      "books"
    ));

    ({ url: pdf_url[0], public_id: pdf_public_id[0] } = await uploadFile(
      pdfFile1.path,
      "PDF"
    ));

    if (pdfFile2) {
      ({ url: pdf_url[1], public_id: pdf_public_id[1] } = await uploadFile(
        pdfFile2.path,
        "PDF"
      ));
    }

    ({ url: epub_url, public_id: epub_public_id } = await uploadFile(
      epubFile.path,
      "EPUB"
    ));

    if (!publisher_name) publisher_name = "";

    if (!publication_year) publication_year = 0;

    newBook = await book.create({
      title,
      author: tempAuthors,
      genre,
      description,
      publisher_name,
      publication_year,
      language,
      page_count,
      cover_image_url,
      ci_public_id,
      pdf_url,
      pdf_public_id,
      epub_url,
      epub_public_id,
      subject,
    });

    res.status(200).json({ message: "Book Created", book: newBook });
  } catch (error) {
    await deleteCloudinaryFile(
      [ci_public_id, ...pdf_public_id, epub_public_id].filter(Boolean)
    );

    if (newBook) {
      await book.findByIdAndDelete(newBook._id);
    }

    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  } finally {
    await deleteStorageFile(
      [coverImage, pdfFile1, pdfFile2, epubFile].filter(Boolean)
    );
  }
});

const updateBook = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Update Book by ID' */
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Book ID is required" });

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
  /* #swagger.summary = 'Delete Book by ID' */
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Book ID is required" });

  try {
    const foundBook = await book.findById(id);

    if (!foundBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    await deleteCloudinaryFile(
      [
        foundBook.ci_public_id,
        ...foundBook.pdf_public_id,
        foundBook.epub_public_id,
      ].filter(Boolean)
    );

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
