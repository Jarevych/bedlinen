// server/middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "bedlinen", // папка у Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const parser = multer({ storage });

module.exports = parser;
