const UserModel = require("../models/userModel");
const PostModel = require("../models/postModel");
// Define the registerController function
exports.registerController = async (req, res) => {
  try {
    // Destructure required fields from request body
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      education,
      work,
      experiences,
      projects,
      skills,
    } = req.body;

    // Validation: Check if all required fields are provided
    if (!firstName || !email || !password || !phone || !address) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields." });
    }

    // Check if user already exists with the provided email
    let user = await UserModel.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ message: "User already exists. Please login." });
    }

    // Create a new user document in the database
    user = await UserModel.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      address,
      education,
      work,
      experiences,
      projects,
      skills,
    });

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      message: "User registered successfully.",
      token,
      user,
    });
  } catch (error) {
    // Handle errors by logging them and sending an error response
    console.error(error);
    res.status(500).json({ success: false, message: "Error in registration." });
  }
};

exports.loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation: Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email is not registered",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid  password",
      });
    }

    const token = await user.generateToken();

    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      success: false,
      message: "Error in login",
    });
  }
};

//Followers
exports.followUnfollow = async (req, res) => {
  try {
    const userToFollow = await UserModel.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }
    const LoggedInUser = await UserModel.findById(req.user._id);

    if (LoggedInUser.following.includes(req.params.id)) {
      let index = LoggedInUser.following.indexOf(req.params.id);
      LoggedInUser.following.splice(index, 1);

      index = userToFollow.followers.indexOf(req.user._id);
      userToFollow.followers.splice(index, 1);

      await LoggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "user unfollowed",
      });
    } else {
      userToFollow.followers.push(req.user._id);
      LoggedInUser.following.push(req.params.id);

      await LoggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success: true,
        message: "user followed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.PostOfFollowing = async (req, res) => {
  try {
    const id = req.user._id;
    console.log(id);
    const user = await UserModel.findById(id).populate("following");
    const posts = await PostModel.find({
      owner: {
        $in: user.following,
      },
    });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
