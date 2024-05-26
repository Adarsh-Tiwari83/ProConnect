const express = require("express");
const {
  createPost,
  deletePost,
  likeAndUnlikePost,
  updateCaption,
  commentOnPost,
  deleteComment,
  repost,
} = require("../controllers/postController");
const { isAuthenticated } = require("../middleware/userMiddleware");

const router = express.Router();

// post
router.post("/create", isAuthenticated, createPost);
router.get("/:id", isAuthenticated, likeAndUnlikePost);
router.put("/:id", isAuthenticated, updateCaption);
router.delete("/:id", isAuthenticated, deletePost);
router.put("/comment/:id", isAuthenticated, commentOnPost);
router.delete("/deleteComment/:id", isAuthenticated, deleteComment);
router.put("/:id/repost", isAuthenticated, repost);

module.exports = router;
