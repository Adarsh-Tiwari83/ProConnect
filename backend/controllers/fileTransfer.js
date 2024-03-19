const uploadOnCloudinary = require("../middleware/cloudinary");
const dataUri = require("../middleware/datauri");


exports.fileUpload = async (req, res) => {
  try {
    const filePath=dataUri(req.file).content;
    const response = await uploadOnCloudinary(filePath);
    console.log(response);
    return res.status(200).json({
      message: "File uploaded successfully on cloudinary",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

