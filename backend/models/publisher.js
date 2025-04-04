const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
    name: {type: String, required: true},
})

const publisher = mongoose.model("publisher", publisherSchema);

module.exports = publisher;
