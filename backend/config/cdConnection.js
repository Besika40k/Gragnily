const cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name: "dskskhpfk",
   api_key: process.env.CD_API_KEY,
   api_secret: process.env.CD_API_SECRET
})

const uploadCoverImage = async (imagePath) => {
   try {
      const result = await cloudinary.uploader.upload(imagePath, {
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
}

module.exports = {
   uploadCoverImage
}
