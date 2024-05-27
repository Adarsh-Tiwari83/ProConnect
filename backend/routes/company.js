const express=require('express');
const { register, login, logout, addJob, removeJob, updateJob, viewApplications,  myProfile, updateProfile, deleteProfile, forgotPassword, resetPassword, viewUser, changePassword } = require('../controllers/company');
const { isAuthenticated } = require('../middleware/companyAuth');
const upload = require("../middleware/multer");
const { fileUpload} = require('../controllers/fileTransfer');
const isGoogleAuthenticated = require('../middleware/isGoogleAuthenticated');

const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/test',isGoogleAuthenticated,(req,res)=>{
    console.log('reached to test');
    res.send('reached to test');
    // res.status(200).json({success:true});
});
router.get('/logout',logout);
router.post('/job',isAuthenticated,addJob);
router.route('/job/:id').delete(isAuthenticated,removeJob).put(isAuthenticated,updateJob);
router.get('/applications/:id',isAuthenticated,viewApplications); 
router.route('/profile').get(isAuthenticated,myProfile).put(isAuthenticated,updateProfile).delete(isAuthenticated,deleteProfile);
router.post('/change-password',isAuthenticated,changePassword);
router.post('/forgotpassword',forgotPassword);
router.post('/resetpassword/:resetToken',resetPassword);
router.route('/user/:id').get(isAuthenticated,viewUser);
router.post('/file-upload',isAuthenticated,upload,fileUpload);

module.exports=router;