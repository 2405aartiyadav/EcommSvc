const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.configDotenv();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

let uploadeProfileImage = async (file, path, name) => {
  let obj = cloudinary.uploader
    .upload(file, {
      folder: path,
      public_id: name,
    })
    .then((resp) => {
      return resp;
    })
    .catch((error) => {
      console.log(error);
      return "failed to upload image in cloudinary";
    });
  return obj;
};
module.exports = uploadeProfileImage;
