const asyncHandler = require("express-async-handler");
const author = require("../models/author");
const {
  uploadProfilePicture,
  deleteCloudinaryFile,
  deleteStorageFile,
} = require("../Utils/fileUtils");
const cloudinary = require("../config/cdConnection");

const getAuthors = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get All Authors' */
  const authors = await author.find();
  if (authors.length == 0) {
    res.status(404).json({ message: "Author(s) not found" });
  } else res.json(authors);
});

const createAuthor = asyncHandler(async (req, res) => {
  /*
  #swagger.tags = ['Authors']
  #swagger.summary = 'Create new Author'
  #swagger.description = 'Creates a new author with optional profile picture'
  #swagger.consumes = ['multipart/form-data']
  #swagger.requestBody = {
    required: true,
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            profile_picture: {
              type: 'string',
              format: 'binary',
              description: 'Optional author profile picture'
            },
            name: {
              type: 'string',
              example: 'J.K. Rowling'
            },
            birth_year: {
              type: 'integer',
              example: 1965
            },
            nationality: {
              type: 'string',
              example: 'British'
            },
            biography: {
              type: 'string',
              example: 'Famous author of Harry Potter.'
            }
          },
          required: ['name']
        }
      }
    }
  }
  #swagger.responses[200] = {
    description: 'Author created successfully',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/Author' }
      }
    }
  }
  #swagger.responses[400] = {
    description: 'Bad request - missing required fields'
  }
  #swagger.responses[500] = {
    description: 'Internal server error'
  }
*/
  const { name, birth_year, nationality, biography } = req.body;

  const profile_picture = req.file;

  let url, public_id;

  if (profile_picture)
    ({ url, public_id } = await uploadProfilePicture(
      profile_picture.path,
      "authors"
    ));

  try {
    const newAuthor = await author.create({
      name,
      birth_year,
      nationality,
      biography,
      profile_picture_url: url || process.env.AUTHOR_PICTURE_URL,
      profile_picture_public_id: public_id || process.env.AUTHOR_PICTURE_ID,
    });
    res
      .status(200)
      .json({ comment: "Author creation successful", author: newAuthor });
  } catch (error) {
    await deleteCloudinaryFile([public_id].filter(Boolean));
    await deleteStorageFile([profile_picture].filter(Boolean));

    res
      .status(500)
      .json({ comment: "Error Creating Author", error: error.message });
  }
});

const getAuthor = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get Author By ID' */
  const authors = await author.findById(req.params.id);
  if (authors.length == 0) {
    res.status(404).json({ comment: "Author Not Found" });
  } else res.status(200).json(authors);
});

const updateAuthor = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Update Author by ID'
    #swagger.description = 'send only what needs to be updated EXCEPT public_url, public_id'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          $ref: '#/components/schemas/Author'
        }
      }
    }
  }
  */
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
  /* #swagger.summary = 'Delete Author by ID' */
  try {
    const { id } = req.params;
    const deletedAuthor = await author.findByIdAndDelete(id);

    if (deleteAuthor.profile_picture_url !== process.env.AUTHOR_PICTURE_URL)
      await cloudinary.uploader.destroy(deleteAuthor.profile_picture_public_id);

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
