const cloudinary = require("../config/cdConnection");
const asyncHandler = require("express-async-handler");
const fs = require("fs").promises;

/**
 * Uploads a cover image to Cloudinary and returns its URL and public ID.
 *
 * @function
 * @async
 * @param {string} imgPath - The local file path of the image to upload.
 * @param {string} destination - The destination folder name in Cloudinary.
 * @returns {Promise<{ url: string, public_id: string }>} An object containing the image URL and its public ID.
 * @throws Will throw an error if the upload fails.
 */
const uploadCoverImage = asyncHandler(async (imgPath, destination) => {
  try {
    const result = await cloudinary.uploader.upload(imgPath, {
      folder: `${destination}/covers`,
      resource_type: "image",
    });

    const url = cloudinary.url(result.public_id, {
      transformation: [
        {
          quality: "auto",
          fetch_format: "auto",
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

/**
 * Uploads a file to Cloudinary and returns its URL and public ID.
 *
 * @async
 * @function uploadFile
 * @param {string} filePath - The path to the file to upload.
 * @param {string} [fileType="PDF"] - The type of the file ("PDF" or "EPUB").
 * @returns {Promise<{url: string, public_id: string}>} An object containing the file's URL and public ID.
 * @throws {Error} If the file type is invalid or the upload fails.
 */
const uploadFile = asyncHandler(async (filePath, fileType = "PDF") => {
  try {
    if (!filePath) return { url: "", public_id: "" };

    let rsType;

    switch (fileType) {
      case "PDF":
        rsType = "auto";
        break;
      case "EPUB":
        rsType = "raw";
        break;
      default:
        throw new Error("Invalid file type");
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

/**
 * Uploads a profile picture to Cloudinary and returns its URL and public ID.
 *
 * @function
 * @async
 * @param {string} filePath - The local file path of the image to upload.
 * @param {string} place - The folder name or context (e.g., user or organization) for organizing the upload.
 * @returns {Promise<{url: string, public_id: string}>} An object containing the Cloudinary URL and public ID of the uploaded image.
 */
const uploadProfilePicture = asyncHandler(async (filePath, place) => {
  if (!filePath) return { url: "", public_id: "" };

  const result = await cloudinary.uploader.upload(filePath, {
    folder: `${place}/profile_picture`,
    resource_type: "image",
  });

  const public_id = result.public_id;
  const url = cloudinary.url(public_id);

  return { url, public_id };
});

/**
 * Asynchronously deletes one or more files from storage.
 *
 * @async
 * @param {Object|Object[]} Files - A file object or an array of file objects to delete. Each file object should have a `path` property specifying the file's location.
 * @returns {Promise<void>} Resolves when all specified files have been processed for deletion.
 */
const deleteStorageFile = async (Files) => {
  if (!Files) return;

  Files = Array.isArray(Files) ? Files : [Files];

  for (const file of Files) {
    try {
      await fs.unlink(file.path);
    } catch (err) {
      console.warn(`Failed to delete temp file: ${file.path}`, err.message);
    }
  }
};

/**
 * Deletes one or more files from Cloudinary using their public IDs.
 *
 * @async
 * @param {string|string[]} public_ids - A single public ID or an array of public IDs of the files to delete from Cloudinary.
 * @returns {Promise<void>} Resolves when all deletions have been attempted.
 */
const deleteCloudinaryFile = async (public_ids) => {
  if (!public_ids) return;

  public_ids = Array.isArray(public_ids) ? public_ids : [public_ids];

  for (const public_id of public_ids) {
    try {
      await cloudinary.uploader.destroy(public_id);
    } catch (err) {
      console.error(
        `Failed to delete file from Cloudinary: ${public_id}`,
        err.message
      );
    }
  }
};

module.exports = {
  uploadCoverImage,
  uploadFile,
  uploadProfilePicture,
  deleteStorageFile,
  deleteCloudinaryFile,
};
