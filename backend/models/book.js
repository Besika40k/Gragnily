const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    title_ge: { type: String, required: true },
    author: [
      {
        author_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "authors",
          required: true,
        },
      },
    ],
    genre: [{ type: String, required: true }],
    genre_ge: [{ type: String, required: true }],
    publisher_name: String,
    publication_year: Number,
    language: { type: String, required: true },
    language_ge: { type: String, required: true },
    page_count: { type: Number, required: true },
    cover_image_url: { type: String, required: true },
    ci_public_id: { type: String, required: true },
    pdf_url: [{ type: String, required: true }],
    pdf_public_id: [{ type: String, required: true }],
    epub_url: String,
    epub_public_id: String,
  },
  { timestamp: true }
);

const book = mongoose.model("book", bookSchema);

module.exports = book;
