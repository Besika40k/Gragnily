const cloudinary = require("../config/cdConnection");
const asyncHandler = require('express-async-handler');

const uploadCoverImage = asyncHandler(async (imgPath) => {
    try {
       const result = await cloudinary.uploader.upload(imgPath, {
          folder: "books/covers",
          resource_type: "image"
       })
 
       const url = cloudinary.url(result.public_id, {
          transformation: [
             {
                quality: 'auto',
                fetch_format: 'auto'
             },
             {
                width: 400,
                height: 600
             }
          ]
       })
       
       return url;
    } catch (error) {
       console.error("Error uploading cover image:", error);
       throw error;
    }
 })


 const uploadFile = asyncHandler(async (filePath, fileType = "PDF") => {
    
    try {
         if(!filePath) return "";

         let rsType = "";

         switch (fileType) {
            case "PDF":
               rsType = "auto"
               break;
            case "EPUB":
               rsType = "raw"
               break;
            default:
               throw new Error("Invalid file type")
               break;
         }

        const result = await cloudinary.uploader.upload(filePath, {
            folder: `books/${fileType}s`,
            resource_type: rsType
         })

         const url = cloudinary.url(result.public_id)

         return url;
    } catch (error) {
        console.error("Error uploading file:", error);
       throw error;
    }



 })


 module.exports = {uploadCoverImage, uploadFile}
