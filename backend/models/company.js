const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    employee_count: {
        type: Number,
        required: true
    },
    job_list:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Job'
    }],
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
})

companySchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

companySchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password, this.password);
}

companySchema.methods.generateToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET);
}

const Company = mongoose.model('Company', companySchema);

module.exports = Company;