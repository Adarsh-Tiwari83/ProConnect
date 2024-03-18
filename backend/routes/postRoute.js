const express = require("express");
const {
  createPost,
  deletePost,
  likeAndUnlikePost,
} = require("../controllers/postController");
const { isAuthenticated } = require("../middleware/userMiddleware");

const router = express.Router();

// post
router.post("/create", isAuthenticated, createPost);
router.get("/:id", isAuthenticated, likeAndUnlikePost);
router.delete("/:id", isAuthenticated, deletePost);

module.exports = router;
