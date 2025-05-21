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

  const likes = await like.findById(userId).select(`${type}s`);

  if (!likes) {
    return res.status(404).json({ message: `Favorite ${type}s Not Found` });
  }

  res.status(200).json(likes);
});

exports.addObjectToLiked = asyncHandler(async (req, res) => {
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
      object = book.findById(objectId);
      break;
    case "article":
      object = article.findById(objectId);
      break;
    default:
      return res.status(400).json({ message: "Invalid type" });
  }
  if (!object) {
    return res.status(404).json({ message: `${type} Not Found` });
  }

  const updatedLikes = await like.findByIdAndUpdate(
    userId,
    {
      $addToSet: { [`${type}s`]: { [`${type}Id`]: objectId } },
    },
    { new: true }
  );

  if (!updatedLikes) {
    return res.status(404).json({ message: "Likes Not Found" });
  }

  res.status(200).json({ message: `${type} added to likes` });
});

exports.removeObjectFromLiked = asyncHandler(async (req, res) => {
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
      object = book.findById(objectId);
      break;
    case "article":
      object = article.findById(objectId);
  }

  if (!object) {
    return res.status(404).json({ message: `${type} Not Found` });
  }

  const updatedLikes = await like.findByIdAndUpdate(
    userId,
    {
      $pull: { [`${type}s`]: { [`${type}Id`]: objectId } },
    },
    { new: true }
  );

  if (!updatedLikes) {
    return res.status(404).json({ message: "Likes Not Found" });
  }

  res.status(200).json({ message: `${type} removed from likes` });
});
