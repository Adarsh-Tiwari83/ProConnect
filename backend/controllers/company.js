const Job = require("../models/job");
const Company = require("../models/company");
const sendEmail=require('../middleware/sendEmail')
const crypto=require('crypto')

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
    const company = await Company.findOne({ email }).select("+password");
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

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

exports.addJob = async (req, res) => {
  try{
    const job = new Job(req.body);
    job.company = req.company._id;
    await job.save();
    const company= await Company.findById(req.company._id);
    company.job_list.push(job._id);
    company.save();
    return res.status(201).json({
      message: "Job added successfully",
      success: true,
      job,
    });
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  
  }
};

exports.updateJob = async (req, res) => {
  try{
    const {id}=req.params;
    const job=await Job.findByIdAndUpdate(id,req.body,{new:true});
    if(!job){
      return res.status(404).json({
        message:"Job not found",
        success:false
      })
    }
    return res.status(200).json({
      message:"Job updated successfully",
      success:true,
      job
    })
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  
  }
};

exports.removeJob = async (req, res) => {
  try{
    const {id}=req.params;
    const job=await Job.findByIdAndDelete(id);
    if(!job){
      return res.status(404).json({
        message:"Job not found",
        success:false
      })
    }
    const company=await Company.findById(req.company._id);
    company.job_list.splice(company.job_list.indexOf(id),1);
    await company.save();
    return res.status(200).json({
      message:"Job removed successfully",
      success:true,
      job
    })
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  
  }
};

exports.viewApplications = async (req, res) => {};

exports.viewUser = async (req, res) => {};

exports.myProfile = async (req, res) => {
  try{
    const company=await Company.findById(req.company._id).populate('job_list');
    return res.status(200).json({
      message:"Company profile",
      success:true,
      company
    })
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try{
    const company=await Company.findByIdAndUpdate(req.company._id,req.body,{new:true});
    if(!company){
      return res.status(404).json({
        message:"Company not found",
        success:false
      })
    }
    return res.status(200).json({
      message:"Company profile updated successfully",
      success:true,
      company
    })
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try{
    const company=await Company.findByIdAndDelete(req.company._id);
    if(!company){
      return res.status(404).json({
        message:"Company not found",
        success:false
      })
    }
    company.job_list.forEach(async (job)=>{
      await Job.findByIdAndDelete(job);
    })
    res.clearCookie("token");
    return res.status(200).json({
      message:"Company deleted successfully",
      success:true,
      company
    })
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

exports.changePassword = async (req, res) => {
  try{
    const company=await Company.findById(req.company._id).select('+password');
    const isMatch=await company.comparePassword(req.body.oldPassword);
    if(!isMatch){
      return res.status(400).json({
        message:"Invalid password",
        success:false
      })
    }
    company.password=req.body.newPassword;
    await company.save();
    return res.status(200).json({
      message:"Password changed successfully",
      success:true,
      company
    })
  }
    catch(err){
      return res.status(500).json({
        message: err.message,
        success: false,
      });
    }
  }

exports.forgotPassword = async (req, res) => {
  try{
    const {email}=req.body;
    const company=await Company.findOne({email});
    if(!company){
      return res.status(404).json({
        message:"Company not found",
        success:false
      })
    }
    const resetToken=company.generatePasswordResetToken();
    await company.save();
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/company/resetpassword/${resetToken}`;
    const message = `<h2>You are receiving this email because you have requested the reset of your password. Please <a href=`+`${resetUrl}`+`>click</a> here to reset the password</h2>`;
    try{
      await sendEmail({
        to:email,
        subject:"Password Reset",
        text:message
      })
      return res.status(200).json({
        message:"Email sent",
        success:true
      })
    }catch(err){
      company.resetPasswordToken=undefined;
      company.resetPasswordExpire=undefined;
      await company.save();
      return res.status(500).json({
        message:"Email could not be sent",
        success:false
      })
    }
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try{
    const resetPasswordToken=crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const company=await Company.findOne({
      resetPasswordToken,
      resetPasswordExpire:{$gt:Date.now()}
    });
    if(!company){
      return res.status(400).json({
        message:"Invalid token",
        success:false
      })
    }
    company.password=req.body.password;
    company.resetPasswordToken=undefined;
    company.resetPasswordExpire=undefined;
    await company.save();
    return res.status(200).json({
      message:"Password reset successful",
      success:true
    })
  }catch(err){
    return res.status(500).json({
      message: err.message,
      success: false,
    });
  }
};