const cloudinary = require("../config/cdConnection");
const asyncHandler = require("express-async-handler");

const uploadCoverImage = asyncHandler(async (imgPath) => {
  try {
    const result = await cloudinary.uploader.upload(imgPath, {
      folder: "books/covers",
      resource_type: "image",
    });

    const url = cloudinary.url(result.public_id, {
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
        },
        {
          width: 400,
          height: 600,
        },
      ],
    });

    const public_id = result.public_id;

    return { url, public_id };
  } catch (error) {
    console.error("Error uploading cover image:", error);
    throw error;
  }
});

const uploadFile = asyncHandler(async (filePath, fileType = "PDF") => {
  try {
    if (!filePath) return { url: "", public_id: "" };

    let rsType = "";

    switch (fileType) {
      case "PDF":
        rsType = "auto";
        break;
      case "EPUB":
        rsType = "raw";
        break;
      default:
        throw new Error("Invalid file type");
        break;
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: `books/${fileType}s`,
      resource_type: rsType,
    });

    const public_id = result.public_id;
    const url = cloudinary.url(public_id);

    return { url, public_id };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
});

const uploadProfilePicture = asyncHandler(async (filePath) => {
  if (!filePath) return { url: "", public_id: "" };

  const result = await cloudinary.uploader.upload(filePath, {
    folder: `users/profile_picture`,
    resource_type: "image",
  });

  const public_id = result.public_id;
  const url = cloudinary.url(public_id);

  return { url, public_id };
});

module.exports = { uploadCoverImage, uploadFile, uploadProfilePicture };
