const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.APIKEY,
    api_secret: process.env.APISECRE,
   
    

})

const storage = new CloudinaryStorage({
  
  cloudinary: cloudinary,
  params: {
    folder: 'losting_img',
    aloudegform: ["png","jpg","jpeg"],
  },
});
 
module.exports = {
    storage,
    cloudinary,
}