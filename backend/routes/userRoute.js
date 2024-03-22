const {
  loginController,
  registerController,
  PostOfFollowing,
  followUnfollow,
  // testController,
} = require("../controllers/userController");

const express = require("express");
const { isAuthenticated } = require("../middleware/userMiddleware");

//router object
const router = express.Router();

//Routing
//Register || Method Post
router.post("/register", registerController);

//LOGIN || Method POST
router.post("/login", loginController);

//LOGOUT || METHOD GET
router.get("/logout", isAuthenticated, logout);

//UPDATE PASSWORD
router.put("/update/password", isAuthenticated, updatePassword);

//GETTING INFO ABOUT PROFILE
router.get("/me", isAuthenticated, myProfile);

//UPDATE PROFILE
router.put("/update/profile", isAuthenticated, updateProfile);

//Delete Profile
router.delete("/delete/profile", isAuthenticated, deleteMyProfile);

//getting userProfile
router.get("/user/:id", isAuthenticated, getUserProfile);

//getting all users from database
router.get("/users", isAuthenticated, getAllUsers);

//followers Method get
router.get("/follow/:id", isAuthenticated, followUnfollow);
router.get("/getpost", isAuthenticated, PostOfFollowing);

module.exports = router;
