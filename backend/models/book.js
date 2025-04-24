const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: [
      {
        author_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "authors",
          required: true,
        },
        name: { type: String, required: true },
      },
    ],
    genre: [{ type: String, required: true }],
    publisher_name: { type: String, required: true },
    publication_year: { type: Number, required: true },
    language: { type: String, required: true },
    page_count: { type: Number, required: true },
    cover_image_url: String,
    ci_public_id: String,
    pdf_url: String,
    pdf_public_id: String,
    epub_url: String,
    epub_public_id: String,
  },
  { timestamp: true }
);

const book = mongoose.model("book", bookSchema);

module.exports = book;
