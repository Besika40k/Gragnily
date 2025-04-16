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


 const uploadFile = asyncHandler(async (filePath) => {
    
    try {
        if(!filePath) return "";

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "books/PDFs"
         })

         const url = cloudinary.url(result.public_id)

         return url;
    } catch (error) {
        console.error("Error uploading PDF file:", error);
       throw error;
    }



 })


 module.exports = {uploadCoverImage, uploadFile}
