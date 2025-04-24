const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: String,
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["admin", "user"],
    },
    profile_picture_url: String,
    profile_picture_public_id: String
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);

module.exports = user;
