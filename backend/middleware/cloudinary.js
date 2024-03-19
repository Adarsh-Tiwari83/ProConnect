const cloudinary = require("cloudinary");


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      return res.status(400).json({
        message: "File not found",
        success: false,
      });
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return response;
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};



module.exports = uploadOnCloudinary;
