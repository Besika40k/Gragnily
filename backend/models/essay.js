const mongoose = require("mongoose");

const essaySchema = new mongoose.Schema(
  {
    author_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    tags: [
      {
        type: String,
        index: true,
        trim: true,
      },
    ],
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    allowAI: {
      type: Boolean,
      default: false,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    cover_image_url: {
      type: String,
      required: true,
    },
    ci_public_id: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        comment: {
          type: String,
          trim: true,
          maxlength: 1000,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const essay = mongoose.model("essay", essaySchema);

module.exports = essay;
