const mongoose = require("mongoose");

const subjects = require("../constants/subjects");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true, enum: subjects },
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
    popularity: { type: Number, default: 0 },
    description: String,
    publisher_name: String,
    publication_year: Number,
    language: { type: String, required: true },
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
