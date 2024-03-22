const JWT = require("jsonwebtoken");
const UserModel = require("../models/userModel.js");

//Protected Routes token base
exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded = await JWT.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = await UserModel.findById(decoded._id);
    console.log(req.user);
    next();
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
