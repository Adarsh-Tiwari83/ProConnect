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

//followers Method get
router.get("/follow/:id", isAuthenticated, followUnfollow);
router.get("/getpost", isAuthenticated, PostOfFollowing);

module.exports = router;
