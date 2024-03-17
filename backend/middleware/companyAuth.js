const jwt=require('jsonwebtoken');
const Company=require('../models/company');

exports.isAuthenticated=async(req,res,next)=>{
    try{
        const {token}=req.cookies;
        if(!token){
            return res.status(401).json({
                message:"Please login to access this resource",
                success:false
            })
        }
        const decoded=await jwt.verify(token,process.env.JWT_SECRET); //decoded will contain the id of the company
        req.company=await Company.findById(decoded.id);
        next();
    }catch(err){
        return res.status(500).json({
            message:err.message,
            success:false
        })
    }
}