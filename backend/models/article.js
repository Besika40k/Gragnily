const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  title: { type: String, required: true },
  cover_image_url: { type: String, required: true },
  ci_public_id: { type: String, required: true },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  Comments: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true,
      },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const article = mongoose.model("article", articleSchema);

module.exports = article;
