const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pending', 'Reviewed', 'Rejected', 'Hired'],
    default: 'Pending',
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  
  // --- References to connect everything ---
  
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // A reference to the Job model
    required: true,
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // A reference to the User model (the applicant)
    required: true,
  },
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // A reference to the User model (the recruiter)
    required: true,
  },
});

module.exports = mongoose.model('Application', applicationSchema);