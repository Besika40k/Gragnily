const asyncHandler = require("express-async-handler");
const cloudinary = require("../config/cdConnection");
const config = require("../config/auth.config");
const user = require("../models/user");
const { uploadProfilePicture } = require("../Utils/fileUtils");
const fs = require("fs").promises;

const getUsers = asyncHandler(async (req, res) => {
  const users = await user.find();

  if (users.length === 0) {
    return res.status(404).json({ message: "Users Not Found" });
  }

  res.status(200).json(users);
});

const getUserLite = asyncHandler(async (req, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: "User Not Registered" });
  }

  const User = await user
    .findById(req.userId)
    .select("username email profile_picture_url");

  if (!User) {
    return res.status(404).json({ message: "User Not Found" });
  }

  res.status(200).json(User);
});

const updateUserTextFields = asyncHandler(async (req, res) => {
  if (!req.userId)
    return res.status(401).json({ message: "User Not Signed In" });

  await user.findByIdAndUpdate(req.userId, { $set: req.body });

  res.status(200).json({ message: "User updated successfully" });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  if (!req.userId)
    return res.status(401).json({ message: "User Not Signed In" });

  const files = req.files;
  const newProfile = files.new_profile?.[0];

  if (!newProfile) {
    return res.status(400).json("No profile image uploaded");
  }

  try {
    const User = await user.findById(req.userId);

    if (User.profile_picture_url !== process.env.PROFILE_PICTURE_URL) {
      await cloudinary.uploader.destroy(User.profile_picture_public_id);
    }

    const { url, public_id } = await uploadProfilePicture(newProfile.path);

    if (!url || !public_id) {
      return res.status(500).json("Upload to Cloudinary failed");
    }

    await user.findByIdAndUpdate(req.userId, {
      profile_picture_url: url,
      profile_picture_public_id: public_id,
    });

    res.status(200).json({ message: "Profile Picture Updated" });
  } catch (err) {
    console.error("Profile update error:", err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  } finally {
    if (newProfile?.path) {
      try {
        await fs.unlink(newProfile.path);
      } catch (err) {
        console.warn(`Failed to delete temp profile image: ${err.message}`);
      }
    }
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  if (!req.userId)
    return res.status(401).json({ message: "User Not Signed In" });

  const User = await user.findById(req.userId);

  if (!User) return res.status(404).json({ message: "User Not Found" });

  if (
    User.profile_picture_url &&
    User.profile_picture_url !== process.env.PROFILE_PICTURE_URL
  ) {
    await cloudinary.uploader.destroy(User.profile_picture_public_id);
  }

  user.findByIdAndDelete(req.userId);

  res
    .clearCookie("x-access-token")
    .clearCookie("x-refresh-token")
    .status(200)
    .json("User Deleted Successfully");
});

module.exports = {
  getUsers,
  getUserLite,
  updateUserProfile,
  updateUserTextFields,
  deleteUser,
};
