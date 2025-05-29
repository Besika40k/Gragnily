const book = require("../models/book");
const article = require("../models/article");
const like = require("../models/likes");
const asyncHandler = require("express-async-handler");

exports.getLikedObjects = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get All Likes by Type'
     #swagger.tags = ['Likes'] */
  const userId = req.userId;
  const { type } = req.query;

  if (!userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }

  let populateOptions = {
    path: `${type}s`,
    select: ``,
  };

  switch (type) {
    case "book":
      populateOptions.select = `_id title title_ge cover_image_url`;
      break;
    case "article":
      populateOptions.select = `_id title cover_image_url`;
      break;
  }

  let likes = await like.findById(userId).populate(populateOptions);

  if (!likes) {
    return res.status(404).json({ message: `Favorite ${type}s Not Found` });
  }

  res.status(200).json(likes);
});

exports.handleLikeButton = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { type, objectId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }
  if (!type || !objectId) {
    return res.status(400).json({ message: "Type and Object ID are required" });
  }

  let object;
  switch (type) {
    case "book":
      object = await book.findById(objectId);
      break;
    case "article":
      object = await article.findById(objectId);
      break;
    default:
      return res.status(400).json({ message: "Invalid type" });
  }

  if (!object) {
    return res.status(404).json({ message: `${type} Not Found` });
  }

  const field = `${type}s`; // "books" or "articles"

  // Check if the user already liked this item
  const likeDoc = await like.findOne({ _id: userId, [field]: objectId });

  let update;
  let message;

  if (likeDoc) {
    // User already liked it, so remove (unlike)
    update = { $pull: { [field]: objectId } };
    message = `${type} removed from likes`;
  } else {
    // User has not liked it yet, so add (like)
    update = { $addToSet: { [field]: objectId } };
    message = `${type} added to likes`;
  }

  const updatedLike = await like.findByIdAndUpdate(userId, update, {
    new: true,
    upsert: true,
  });

  if (!updatedLike) {
    return res.status(500).json({ message: "Failed to update likes" });
  }

  res.status(200).json({ message });
});
