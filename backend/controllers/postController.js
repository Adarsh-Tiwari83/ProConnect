const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");
const mongoose = require("mongoose");

exports.createPost = async (req, res) => {
  try {
    console.log(req.user._id);
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: req.user._id, //server khud se isko fetch krlega kyuli decoded me apn ne req.user krke save kr rkhah
    };

    //creating post
    const post = await PostModel.create(newPostData);

    //finding user by id
    const user = await UserModel.findById(req.user._id);

    //pushing ths user in the post array
    user.posts.push(post._id);

    //saving the post to user
    await user.save();

    res.status(201).json({
      success: true,
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    //findig the post by id
    const post = await PostModel.findById(req.params.id);

    //if post not found
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    //removing the post
    await post.deleteOne();

    //removing the post from user
    const user = await UserModel.findById(req.user._id);
    const index = user.posts.indexOf(req.params.id);

    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.likeAndUnlikePost = async (req, res) => {
  try {
    //findig the post by id
    const post = await PostModel.findById(req.params.id);

    //if post not found
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //if already the post is liked
    console.log(req.user._id);
    if (post.likes.includes(req.user._id)) {
      const index = post.likes.indexOf(req.user._id);

      post.likes.splice(index, 1);

      await post.save();
      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      //liking the post
      post.likes.push(req.user._id);

      //saving the user id to like array
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATA CAPTION
exports.updateCaption = async (req, res) => {
  try {
    const postId = req.params.id;
    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }
    // console.log(req.params.id);

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    post.caption = req.body.caption;

    await post.save();
    res.status(200).json({
      success: true,
      message: "Post updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//comment on post is added

exports.commentOnPost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    let commentIndex = -1;

    //checking ig comment already exists
    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index;
      }
    });

    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;
      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment Updated",
      });
    } else {
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });

      await post.save();
      return res.status(200).json({
        success: true,
        message: "Comment added",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Deleting the comment

exports.deleteComment = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    //if wala condition sirf owner kliye h jo sbhi post lo delete kr skta h but else wla sirf whis user delete kr skta h jiks o post h
    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId == undefined) {
        return res.status(400).json({
          success: false,
          message: "Comment Id is required",
        });
      }

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected comment has deleted",
      });
    } else {
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Your Comment has deleted",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.repost = async (req, res) => {
  try {
    const originalPost = await PostModel.findById(req.params.id);

    if (!originalPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Create a new post with reference to the original post
    const newPostData = {
      caption: originalPost.caption,
      image: originalPost.image,
      owner: req.user._id,
      originalPost: originalPost._id,
    };

    const repostedPost = await PostModel.create(newPostData);

    // Add the reposting user to the original post's reposts array
    originalPost.reposts.push(req.user._id);
    originalPost.repostCount += 1; // Increment repost count
    await originalPost.save();

    res.status(201).json({
      success: true,
      post: repostedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
