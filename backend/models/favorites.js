const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
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

const favorite = mongoose.model("favorite", favoriteSchema);

module.exports = favorite;
