// authRoutes.js
const express = require("express");
const passport = require("passport");
const router = express.Router();

// Route for initiating Google OAuth authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route for handling Google OAuth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect to a success page or handle as needed
    console.log("User authenticated");
    res.redirect("/api/v1");
  }
);

// Route for logging out
router.get("/logout", (req, res) => {
  req.logout(); // Provided by Passport.js to clear the user session
  res.redirect("/api/v1");
});

module.exports = router;
