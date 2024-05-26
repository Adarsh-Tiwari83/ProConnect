const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please Enter your Name"],
    },
    lastName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Please Enter an email"],
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      required: true,
      // minlength: [6, "Password must be at least 6 characters"],
      // select: false,
    },
    phone: {
      type: String,
      required: true,
    },
    educations: [
      {
        type: String,
        required: false,
      },
    ],
    address: {
      type: String,
      required: true,
    },
    work: [
      {
        company: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
        },
        position: {
          type: String,
        },
      },
    ],
    experiences: [
      {
        type: String,
      },
    ],
    projects: [
      {
        type: String,
      },
    ],
    skills: [
      {
        skill: {
          type: String,
        },
        category: {
          type: String,
          enum: ["Language", "Tools and Technology", "Soft Skills"],
          required: true,
        },
      },
    ],
    endorsements: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    jobApplications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", //this is the reference to the post model
      },
    ],

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    companyFollowing: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },
    ],
    connectRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    connectionPending: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    allConnections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return JWT.sign({ _id: this._id }, process.env.JWT_SECRET);
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log(resetToken);

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
