const Job = require("../models/job");
const Company = require("../models/company");

exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    const company = await Company.findOne({ email });
    if (company) {
      return res.status(400).json({
        message: "Company already exists",
        success: false,
      });
    }
    const newCompany = new Company(req.body);
    await newCompany.save();
    const token = newCompany.generateToken();
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    return res.status(201).cookie("token", token,options).json({
      message: "Company created successfully",
      success: true,
      newCompany,
      token
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }
    const isMatch = await company.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const token = company.generateToken();
    return res.status(200).cookie("token", token).json({
      message: "Company logged in successfully",
      success: true,
      company,
      token
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

exports.logout = async (req, res) => {};

exports.addJob = async (req, res) => {};

exports.updateJob = async (req, res) => {};

exports.removeJob = async (req, res) => {};

exports.viewApplications = async (req, res) => {};

exports.searchUser = async (req, res) => {};

exports.viewUser = async (req, res) => {};

exports.myProfile = async (req, res) => {};

exports.updateProfile = async (req, res) => {};

exports.deleteProfile = async (req, res) => {};

exports.forgotPassword = async (req, res) => {};

exports.resetPassword = async (req, res) => {};
