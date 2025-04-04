const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name : {type: String, required:true },
  birth_year : {type: Date},
  nationality : {type: String}
})

const author = mongoose.model("author", authorSchema);

module.exports = author;
