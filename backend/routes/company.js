const express=require('express');
const { register, login, logout, addJob, removeJob, updateJob, viewApplications, searchUser, myProfile, updateProfile, deleteProfile, forgotPassword, resetPassword, viewUser } = require('../controllers/company');
const { isAuthenticated } = require('../middleware/companyAuth');

const router=express.Router();

router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.post('/job',isAuthenticated,addJob);
router.route('/job/:id').delete(isAuthenticated,removeJob).put(isAuthenticated,updateJob);
router.get('/applications/:id',isAuthenticated,viewApplications); 
router.post('/search',isAuthenticated,searchUser);
router.route('/profile').get(isAuthenticated,myProfile).put(isAuthenticated,updateProfile).delete(isAuthenticated,deleteProfile);
router.post('/forgotpassword',forgotPassword);
router.post('/resetpassword',resetPassword);
router.route('/user/:id').get(isAuthenticated,viewUser);

module.exports=router;