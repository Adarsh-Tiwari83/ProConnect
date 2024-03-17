const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    skillsRequired:{
        type: [String],
        required: true
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company'
    },
    applicants:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User'
    }
})

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;