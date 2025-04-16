const cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name: "dskskhpfk",
   api_key: process.env.CD_API_KEY,
   api_secret: process.env.CD_API_SECRET
})

module.exports = cloudinary;
