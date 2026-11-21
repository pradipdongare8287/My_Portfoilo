const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name:process.env.cloudnary_name,
    api_key :process.env.cloudnary_api_key,
    api_secret :process.env.cloudnary_secret_key
})

module.exports= cloudinary