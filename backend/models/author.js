const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_ge: { type: String, required: true },
  birth_year: Date,
  nationality: String,
  biography: String,
  biography_ge:String,
  profile_picture_url: String,
  profile_picture_public_id: String,
});

const author = mongoose.model("author", authorSchema);

module.exports = author;
