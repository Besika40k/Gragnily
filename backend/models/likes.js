const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    books: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
      },
    ],
    articles: [
      {
        articleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const like = mongoose.model("like", likeSchema);

module.exports = like;
