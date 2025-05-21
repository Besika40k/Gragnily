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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
      },
    ],
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Article",
      },
    ],
  },
  { timestamps: true }
);

const like = mongoose.model("like", likeSchema);

module.exports = like;
