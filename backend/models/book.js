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
    cover_image_url: { type: String },
    ci_public_id: { type: String },
    pdf_url: { type: String },
    pdf_public_id: { type: String },
    epub_url: { type: String },
    epub_public_id: { type: String },
  },
  { timestamp: true }
);

const book = mongoose.model("book", bookSchema);

module.exports = book;
