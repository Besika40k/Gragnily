const essay = require("../models/essay");
const asyncHandler = require("express-async-handler");
const {
  uploadCoverImage,
  deleteCloudinaryFile,
  deleteStorageFile,
} = require("../Utils/fileUtils");
const cloudinary = require("../config/cdConnection");
const like = require("../models/likes");

exports.getEssay = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get Essay by ID' */
  const { id } = req.params;
  let liked = false;

  if (!id) return res.status(400).json({ message: "Essay ID is required" });

  const Essay = await essay
    .findById(id)
    .populate("author_id", "username profile_picture_url");

  if (!Essay) {
    return res.status(404).json({ message: "Essay Not Found" });
  }

  if (req.userId) {
    liked = (await like.findOne({ _id: req.userId, ["essays"]: id }))
      ? true
      : false;
  }

  const numOfEssays = await essay
    .countDocuments()
    .where({ author_id: Essay.author_id._id });

  res.status(200).json({ Essay, numOfEssays: numOfEssays, liked });
});

exports.getEssays = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get all Essays' */
  const Essays = await essay.find();
  if (Essays.length == 0) {
    res.status(404).json({ message: "Essays Not Found" });
  } else {
    res.status(200).json(Essays);
  }
});

exports.getUserEssays = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get Essays by User' */
  const userId = req.userId;

  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const Essays = await essay
    .find({ author_id: userId })
    .populate("author_id", "username profile_picture_url");

  if (Essays.length == 0) {
    return res.status(404).json({ message: "Essays Not Found" });
  }

  res.status(200).json(Essays);
});

exports.postEssay = asyncHandler(async (req, res) => {
  /* 
  #swagger.summary = 'Post Essay' 
  #swagger.consumes = ['multipart/form-data']
  #swagger.requestBody = {
    required: true,
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            cover_image: {
              type: "string",
              format: "binary",
              description: "Cover image file"
            },
            title: {
              type: "string",
              description: "Essay title"
            },
            content: {
              type: "string",
              description: "Essay content"
            },
            tags: {
              type: "string",
              description: "Tags"
            },
            subject: {
              type: "string",
              description: "Subject"
            },
            allowAI: {
              type: "boolean",
              description: "Allow AI suggestions"
            }
          },
          required: ["cover_image", "title", "content"]
        }
      }
    }
  }
*/

  if (!req.userId) {
    return res.status(401).json({ message: "User Not Logged In" });
  }

  const { title, content, tags, subject, allowAI } = req.body;
  const cover_image = req.file;
  let cover_image_url, ci_public_id;

  try {
    if (!cover_image) {
      return res.status(400).json({ message: "Cover image is required" });
    }

    ({ url: cover_image_url, public_id: ci_public_id } = await uploadCoverImage(
      cover_image.path,
      "Essays"
    ));

    const newEssay = await essay.create({
      title,
      allowAI,
      author_id: req.userId,
      cover_image_url,
      ci_public_id,
      tags,
      subject,
      content,
      Comments: [],
      likes: 0,
      favorites: 0,
    });

    await deleteStorageFile([cover_image].filter(Boolean));

    res.status(201).json(newEssay);
  } catch (error) {
    console.log(error);

    await deleteCloudinaryFile([ci_public_id].filter(Boolean));
    await deleteStorageFile([cover_image].filter(Boolean));

    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.editEssay = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Edit Essay'
     #swagger.consumes = ['multipart/form-data']
     #swagger.requestBody = {
       required: true,
       content: {
         "multipart/form-data": {
           schema: {
             type: "object",
             properties: {
               cover_image: {
                 type: "string",
                 format: "binary",
                 description: "Cover image file"
               },
               title: {
                 type: "string",
                 description: "Essay title"
               },
               content: {
                 type: "string",
                 description: "Essay content"
               },
               tags: {
                 type: "string",
                 description: "Tags"
               },
               subject: {
                 type: "string",
                 description: "Subject"
               },
             },
           }
         }
       }
     }
  */

  const { id } = req.params;
  const { title, content, tags, subject } = req.body;
  const cover_image = req.file;

  let url, public_id;

  if (!id) return res.status(400).json({ message: "Essay ID is required" });

  try {
    const essayToUpdate = await essay.findById(id);

    if (!essayToUpdate) {
      return res.status(404).json({ message: "Essay not found" });
    }

    // Update fields if provided
    if (title) essayToUpdate.title = title;
    if (content) essayToUpdate.content = content;
    if (tags) essayToUpdate.tags = tags;
    if (subject) essayToUpdate.subject = subject;

    // Handle cover image update
    if (cover_image) {
      if (essayToUpdate.ci_public_id) {
        await cloudinary.uploader.destroy(essayToUpdate.ci_public_id);
      }

      ({ url, public_id } = await uploadCoverImage(cover_image.path, "Essays"));

      essayToUpdate.cover_image_url = url;
      essayToUpdate.ci_public_id = public_id;
    }

    await essayToUpdate.save();

    await deleteStorageFile([cover_image].filter(Boolean));

    res.status(200).json(essayToUpdate);
  } catch (error) {
    await deleteCloudinaryFile([public_id].filter(Boolean));
    await deleteStorageFile([cover_image].filter(Boolean));

    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.deleteEssay = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Delete Essay' */
  const { id } = req.params;
  const userId = req.userId;
  if (!id) return res.status(400).json({ message: "Essay ID is required" });

  try {
    const essayToDelete = await essay.findById(id);

    if (essayToDelete.author_id.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this essay" });
    }

    if (!essayToDelete) {
      return res.status(404).json({ message: "Essay not found" });
    }

    await deleteCloudinaryFile(essayToDelete.ci_public_id);

    await essay
      .findByIdAndDelete(id)
      .then(() => {
        console.log("Essay deleted from database");
      })
      .catch((err) => {
        return console.error("Error deleting essay from database", err);
      });

    res.status(200).json({ message: "Essay deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.addComment = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Comment on Essay' */
  const { id } = req.params;
  const { comment } = req.body;

  if (!id) return res.status(400).json({ message: "Essay ID is required" });
  if (!comment) return res.status(400).json({ message: "Comment is required" });

  try {
    const essayToComment = await essay.findById(id);

    if (!essayToComment) {
      return res.status(404).json({ message: "Essay not found" });
    }

    essayToComment.comments.push({
      userId: req.userId,
      comment,
      createdAt: new Date(),
    });

    await essayToComment.save();

    res.status(200).json(essayToComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.deleteComment = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Delete Comment on Essay' */
  const { essayId, commentId } = req.params;

  if (!essayId)
    return res.status(400).json({ message: "Essay ID is required" });
  if (!commentId)
    return res.status(400).json({ message: "Comment ID is required" });
  try {
    const essayToUpdate = await essay.findById(essayId);

    if (!essayToUpdate) {
      return res.status(404).json({ message: "Essay not found" });
    }

    essayToUpdate.comments = essayToUpdate.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await essayToUpdate.save();

    res.status(200).json(essayToUpdate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});
