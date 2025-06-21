const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')
//Configure cloudinary with your credentials for finding account where to post
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})
//Mentioning the cloudinary account where to store then the folder to use and then allowed formats in your parsing
const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'Project1',
        allowedFormats:["jpg","png","jpeg","webp"]
    }
})
module.exports={cloudinary,storage}