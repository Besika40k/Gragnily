const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_ge: { type: String, required: true },
  birth_year: Date,
  nationality: String,
});

const author = mongoose.model("author", authorSchema);

module.exports = author;
