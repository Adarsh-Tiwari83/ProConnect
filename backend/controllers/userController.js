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

//logout
exports.logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: false,
        message: "Logged out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
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

//UPDATE PASSWORD
exports.updatePassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide old and new Password",
      });
    }

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    }

    user.password = newPassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Password updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      education,
      work,
      experiences,
      projects,
      skills,
    } = req.body;

    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (email) {
      user.email = email;
    }
    if (phone) {
      user.phone = phone;
    }
    if (address) {
      user.address = address;
    }
    if (education) {
      user.education = education;
    }
    if (work) {
      user.work = work;
    }
    if (experiences) {
      user.experiences = experiences;
    }
    if (projects) {
      user.projects = projects;
    }
    if (skills) {
      user.skills = skills;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//DELETE PROFILE
exports.deleteMyProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    const posts = user.posts;
    const followers = user.followers;
    const following = user.following;
    const userId = user._id;

    await user.deleteOne();

    //logout user after deleting the profile
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    //deleting all the post of the user
    for (let i = 0; i < posts.length; i++) {
      const post = await PostModel.findById(posts[i]);
      await post.deleteOne();
    }

    //removing all user from followers  following
    for (let i = 0; i < followers.length; i++) {
      const follower = await UserModel.findById(followers[i]);

      const index = follower.following.indexOf(userId);
      follower.following.splice(index, 1);

      await follower.save();
    }

    //removing all user from following's followers
    for (let i = 0; i < following.length; i++) {
      const follows = await UserModel.findById(following[i]);

      const index = follows.followers.indexOf(userId);
      follows.followers.splice(index, 1);

      await follows.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GETTING PROFILE INFORMATAION
exports.myProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).populate("posts");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GETTING USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).populate("posts");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Getting all user which are in database
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({});

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
