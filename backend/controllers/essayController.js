const essay = require("../models/essay");
const asyncHandler = require("express-async-handler");
const { uploadCoverImage } = require("../Utils/fileUtils");
const cloudinary = require("../config/cdConnection");

exports.getEssays = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get all Essays' */
  const Essays = await essay.find();
  if (Essays.length == 0) {
    res.status(404).json({ message: "Essays Not Found" });
  } else {
    res.status(200).json(Essays);
  }
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

    res.status(201).json(newEssay);
  } catch (error) {
    console.log(error);
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
          required: ["cover_image", "title", "content"]
        }
      }
    }
  }
*/
  const { id } = req.params;
  let { name, content, tags, subject } = req.body;
  const cover_image = req.file;

  if (!id) return res.status(400).json({ message: "Essay ID is required" });

  try {
    const essayToUpdate = await essay.findById(id);

    if (!essayToUpdate) {
      return res.status(404).json({ message: "Essay not found" });
    }

    if (!name) name = essayToUpdate.name;
    if (!content) content = essayToUpdate.content;
    if (!tags) tags = essayToUpdate.tags;
    if (!subject) subject = essayToUpdate.subject;

    let cover_image_url, ci_public_id;

    if (cover_image) {
      cloudinary.uploader.destroy(essayToUpdate.ci_public_id).then(() => {
        ({ cover_image_url, ci_public_id } = uploadCoverImage(
          cover_image.path,
          "Essays"
        ).catch((err) => {
          console.error("Error uploading image to Cloudinary", err);
          res.status(500).json({ message: "Image upload failed", error: err });
        }));
      });
    } else {
      cover_image_url = essayToUpdate.cover_image_url;
      ci_public_id = essayToUpdate.ci_public_id;
    }

    const updatedEssay = await essay.findByIdAndUpdate(
      id,
      {
        name,
        content,
        cover_image_url,
        ci_public_id,
      },
      { new: true }
    );

    res.status(200).json(updatedEssay);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.deleteEssay = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Delete Essay' */
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Essay ID is required" });

  try {
    const essayToDelete = await essay.findById(id);

    if (!essayToDelete) {
      return res.status(404).json({ message: "Essay not found" });
    }

    cloudinary.uploader
      .destroy(essayToDelete.ci_public_id)
      .then(() => {
        console.log("Image deleted from Cloudinary");
        essay
          .findByIdAndDelete(id)
          .then(() => {
            console.log("Essay deleted from database");
          })
          .catch((err) => {
            console.error("Error deleting essay from database", err);
          });
      })
      .catch((err) => {
        console.error("Error deleting image from Cloudinary", err);
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

    essayToComment.Comments.push({
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

    essayToUpdate.Comments = essayToUpdate.Comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await essayToUpdate.save();

    res.status(200).json(essayToUpdate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});
