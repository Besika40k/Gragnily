const asyncHandler = require("express-async-handler");
const book = require("../models/book");
const authors = require("../models/author");
const cloudinary = require("../config/cdConnection");
const { uploadCoverImage, uploadFile } = require("../Utils/fileUtils");
const pdf = require("pdf-parse");
const fs = require("fs").promises;

const getBooks = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get all Books'*/
  const books = await book.find();
  if (book.length == 0) res.status(404).json({ message: "Books Not Found" });
  else res.status(200).json(books);
});

const getBooksFiltered = asyncHandler(async (req, res) => {
  const { page, limit, popularity, name, date, author, subject, searchInput } =
    req.query;

  // Sorting
  let sort = {};
  if (name) sort.title = name === "desc" ? -1 : 1;
  if (author) sort.author = author === "desc" ? -1 : 1;
  if (popularity) sort.popularity = popularity === "desc" ? -1 : 1;
  if (date) sort.publication_year = date === "desc" ? -1 : 1;

  // Pagination
  const pageNumber = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * pageSize;

  let Books = [];
  let totalBooks = 0;
  const query = subject && subject.trim() !== "" ? { subject } : {};

  if (searchInput) {
    const pipeline = [];

    if (subject && subject.trim() !== "") {
      pipeline.push({ $match: { subject } });
    }
    if (sort && Object.keys(sort).length > 0) {
      pipeline.push({ $sort: sort });
    }

    pipeline.push({
      $search: {
        index: "titleSearchIndex",
        text: {
          query: searchInput, // Replace with your input
          path: "title",
          fuzzy: {
            maxEdits: 2, // Up to 2 character edits
            prefixLength: 1, // (optional) require first character to match
            maxExpansions: 50, // (optional) limit fuzzy candidates
          },
        },
      },
    });

    // Count total results
    const countResults = await book.aggregate([
      ...pipeline,
      { $count: "total" },
    ]);

    totalBooks = countResults[0]?.total || 0;

    console.log(pipeline);

    // Get paginated results
    Books = await book.aggregate([
      ...pipeline,
      {
        $project: {
          _id: 1,
          title: 1,
          cover_image_url: 1,
          score: { $meta: "searchScore" },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]);
  } else {
    totalBooks = await book.countDocuments(query);

    Books = await book
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .select("_id title title_ge cover_image_url");
  }

  const pages = Math.ceil(totalBooks / pageSize);

  res.status(200).json({ pages, Books });
});

const getBook = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get a book by ID' */
  const { id } = req.params;

  const foundBook = await book
    .findById(id)
    .select("-ci_public_id -epub_public_id -pdf_public_id");

  if (foundBook.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json(foundBook);
});

const getBooksPreview = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Search and Preview Books by Title' */
  const { searchInput, page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);
  const skip = (pageNumber - 1) * pageSize;

  const results = await book.aggregate([
    {
      $search: {
        index: "titleSearchIndex",
        text: {
          query: searchInput,
          path: "title",
          fuzzy: { maxEdits: 2 },
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        cover_image_url: 1,
        score: { $meta: "searchScore" },
      },
    },
    { $sort: { score: -1 } },
    { $skip: skip },
    { $limit: pageSize },
  ]);

  res.status(200).json(results);
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
              title_ge: { type: "string" },
              author: {
                type: "array",
                items: { type: "string" },
                description: "Array of author IDs"
              },
              genre: {
                type: "array",
                items: { type: "string" }
              },
              genre_ge: {
                type: "array",
                items: { type: "string" }
              },
              description: { type: "string" },
              description_ge: { type: "string" },
              publisher_name: { type: "string" },
              publication_year: {
                type: "integer",
                example: 2023
              },
              language: { type: "string" },
              language_ge: { type: "string" },
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
              "title_ge",
              "author",
              "genre",
              "genre_ge",
              "language",
              "language_ge",
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
    // prettier-ignore
    if (ci_public_id) await cloudinary.uploader.destroy(ci_public_id);
    if (pdf_public_id[0]) await cloudinary.uploader.destroy(pdf_public_id[0]);
    if (pdf_public_id[1]) await cloudinary.uploader.destroy(pdf_public_id[1]);
    if (epub_public_id) await cloudinary.uploader.destroy(epub_public_id);

    if (newBook) {
      await book.findByIdAndDelete(newBook._id);
    }

    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  } finally {
    const tempFiles = [coverImage, pdfFile1, pdfFile2, epubFile].filter(
      Boolean
    );

    for (const file of tempFiles) {
      try {
        await fs.unlink(file.path);
      } catch (err) {
        console.warn(`Failed to delete temp file: ${file.path}`, err.message);
      }
    }
  }
});

const updateBook = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Update Book by ID' */
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Book ID is required" });

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
  /* #swagger.summary = 'Delete Book by ID' */
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
    if (foundBook.pdf_public_id[0])
      await cloudinary.uploader.destroy(foundBook.pdf_public_id[0]);
    if (foundBook.pdf_public_id[1])
      await cloudinary.uploader.destroy(foundBook.pdf_public_id[1]);
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
  getBooksPreview,
  getBooks,
  getBooksFiltered,
  createBook,
  getBook,
  updateBook,
  deleteBook,
};
