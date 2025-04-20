const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let resourceType = "image";
    if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
    }
    console.log(
      "Uploading file:",
      file.originalname,
      "with resource type:",
      resourceType
    ); // Log file type
    return {
      folder: "Posts",
      resource_type: resourceType,
      public_id: `${Date.now()}-${file.originalname}`,
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
