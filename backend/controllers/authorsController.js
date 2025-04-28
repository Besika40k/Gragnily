const asyncHandler = require("express-async-handler");
const author = require("../models/author");

const getAuthors = asyncHandler(async (req, res) => {
  const authors = await author.find();
  if (authors.length == 0) {
    res.status(404).json({ message: "Author(s) not found" });
  } else res.json(authors);
});

const createAuthor = asyncHandler(async (req, res) => {
  const { name, name_ge, birth_year, nationality } = req.body;
  if (!name) {
    res.status(400).json({ comment: "name can't be empty" });
  } else {
    try {
      const newAuthor = await author.create({
        name,
        name_ge,
        birth_year,
        nationality,
      });
      res
        .status(200)
        .json({ comment: "Author creation successful", author: newAuthor });
    } catch (error) {
      res
        .status(500)
        .json({ comment: "Error Created Author", error: error.message });
    }
  }
});

const getAuthor = asyncHandler(async (req, res) => {
  const authors = await author.findById(req.params.id);
  if (authors.length == 0) {
    res.status(404).json({ comment: "Author Not Found" });
  } else res.status(200).json(authors);
});

const updateAuthor = asyncHandler(async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;

    const updatedAuthor = await author.findByIdAndUpdate(
      id, // Filter to find the Author by ID
      { $set: req.body }, // Updates only the fields provided in the request body
      { new: true } // Return the updated document
    );

    res
      .status(200)
      .json({ comment: "Author successfully updated", Author: updatedAuthor });
  } catch (error) {
    res
      .status(500)
      .json({ comment: "Error Updating Author", error: error.message });
  }
});

const deleteAuthor = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAuthor = await author.findByIdAndDelete(id);
    res
      .status(200)
      .json({ comment: "Author successfully deleted", Author: deletedAuthor });
  } catch (error) {
    res
      .status(500)
      .json({ comment: "Error Deleting Author", error: error.message });
  }
});

module.exports = {
  getAuthors,
  createAuthor,
  getAuthor,
  updateAuthor,
  deleteAuthor,
};
