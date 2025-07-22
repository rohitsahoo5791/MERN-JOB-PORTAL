// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  location: String,
  salary: Number,
  description: String,
  category: String,
  date: {
    type: Date,
    default: Date.now,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Recruiter who created the job
    required: true,
  },
});

module.exports = mongoose.model('Job', jobSchema);
