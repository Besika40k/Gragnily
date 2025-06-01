const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    books: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "book",
      },
    ],
    essays: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "essay",
      },
    ],
  },
  { timestamps: true }
);

const like = mongoose.model("like", likeSchema);

module.exports = like;
