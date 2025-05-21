const book = require("../models/book");
const article = require("../models/article");
const favorite = require("../models/favorites");
const asyncHandler = require("express-async-handler");

exports.getFavoriteObjects = asyncHandler(async (req, res) => {
  /* #swagger.summary = 'Get All Favorites by Type'
     #swagger.tags = ['Favorites'] */
  const userId = req.userId;
  const { type } = req.query;

  if (!userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }

  const favorites = await favorite.findById(userId).select(`${type}s`);

  if (!favorites) {
    return res.status(404).json({ message: `Favorite ${type}s Not Found` });
  }

  res.status(200).json(favorites);
});

exports.addObjectToFavorites = asyncHandler(async (req, res) => {
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

  const updatedFavorites = await favorite.findByIdAndUpdate(
    userId,
    {
      $addToSet: { [`${type}s`]: { [`${type}Id`]: objectId } },
    },
    { new: true }
  );

  if (!updatedFavorites) {
    return res.status(404).json({ message: "Favorites Not Found" });
  }

  res.status(200).json({ message: `${type} added to favorites` });
});

exports.removeObjectFromFavorites = asyncHandler(async (req, res) => {
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

  const updatedFavorites = await favorite.findByIdAndUpdate(
    userId,
    {
      $pull: { [`${type}s`]: { [`${type}Id`]: objectId } },
    },
    { new: true }
  );

  if (!updatedFavorites) {
    return res.status(404).json({ message: "Favorites Not Found" });
  }

  res.status(200).json({ message: `${type} removed from favorites` });
});
