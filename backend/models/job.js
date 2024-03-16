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
    company:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Company'
    }
})

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;