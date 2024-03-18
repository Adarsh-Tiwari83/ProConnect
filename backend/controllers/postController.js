const PostModel = require("../models/postModel");
const UserModel = require("../models/userModel");

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
