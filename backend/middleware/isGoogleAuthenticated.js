// isAuthenticated.js
const isGoogleAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    message: "Unauthorized access",
    success: false,
  });
};

module.exports = isGoogleAuthenticated;
