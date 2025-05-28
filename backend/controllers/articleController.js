const article = require("../models/article");
const asyncHandler = require("express-async-handler");
const { uploadCoverImage } = require("../Utils/fileUtils");
const cloudinary = require("../config/cdConnection");

exports.getArticles = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get all Articles' */
  const articles = await article.find();
  if (articles.length == 0) {
    res.status(404).json({ message: "Articles Not Found" });
  } else {
    res.status(200).json(articles);
  }
});

exports.postArticle = asyncHandler(async (req, res) => {
  /* 
  #swagger.summary = 'Post Article' 
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
              description: "Article title"
            },
            content: {
              type: "string",
              description: "Article content"
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
      "articles"
    ));

    const newArticle = await article.create({
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

    res.status(201).json(newArticle);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.editArticle = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Edit Article'
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
              description: "Article title"
            },
            content: {
              type: "string",
              description: "Article content"
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

  if (!id) return res.status(400).json({ message: "Article ID is required" });

  try {
    const articleToUpdate = await article.findById(id);

    if (!articleToUpdate) {
      return res.status(404).json({ message: "Article not found" });
    }

    if (!name) name = articleToUpdate.name;
    if (!content) content = articleToUpdate.content;
    if (!tags) tags = articleToUpdate.tags;
    if (!subject) subject = articleToUpdate.subject;

    let cover_image_url, ci_public_id;

    if (cover_image) {
      cloudinary.uploader.destroy(articleToUpdate.ci_public_id).then(() => {
        ({ cover_image_url, ci_public_id } = uploadCoverImage(
          cover_image.path,
          "articles"
        ).catch((err) => {
          console.error("Error uploading image to Cloudinary", err);
          res.status(500).json({ message: "Image upload failed", error: err });
        }));
      });
    } else {
      cover_image_url = articleToUpdate.cover_image_url;
      ci_public_id = articleToUpdate.ci_public_id;
    }

    const updatedArticle = await article.findByIdAndUpdate(
      id,
      {
        name,
        content,
        cover_image_url,
        ci_public_id,
      },
      { new: true }
    );

    res.status(200).json(updatedArticle);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.deleteArticle = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Delete Article' */
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Article ID is required" });

  try {
    const articleToDelete = await article.findById(id);

    if (!articleToDelete) {
      return res.status(404).json({ message: "Article not found" });
    }

    cloudinary.uploader
      .destroy(articleToDelete.ci_public_id)
      .then(() => {
        console.log("Image deleted from Cloudinary");
        article
          .findByIdAndDelete(id)
          .then(() => {
            console.log("Article deleted from database");
          })
          .catch((err) => {
            console.error("Error deleting article from database", err);
          });
      })
      .catch((err) => {
        console.error("Error deleting image from Cloudinary", err);
      });

    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.likedArticle = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Like Article' */
  const { id, point } = req.params;

  if (!id) return res.status(400).json({ message: "Article ID is required" });

  try {
    const articleToLike = await article.findById(id);

    if (!articleToLike) {
      return res.status(404).json({ message: "Article not found" });
    }

    switch (point) {
      case "up":
        articleToLike.likes += 1;
        break;
      case "down":
        articleToLike.likes -= 1;
        break;
      default:
        return res.status(400).json({ message: "Invalid point value" });
    }

    await articleToLike.save();

    res.status(200).json(articleToLike);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});

exports.favoritesArticle = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Favorite Article' */
  const { id, point } = req.params;

  if (!id) return res.status(400).json({ message: "Article ID is required" });

  try {
    const articleToFavorite = await article.findById(id);

    if (!articleToFavorite) {
      return res.status(404).json({ message: "Article not found" });
    }
    switch (point) {
      case "up":
        articleToFavorite.favorites += 1;
        break;
      case "down":
        articleToFavorite.favorites -= 1;
        break;
      default:
        return res.status(400).json({ message: "Invalid point value" });
    }

    await articleToFavorite.save();

    res.status(200).json(articleToFavorite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", error });
  }
});
