const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    // Add 'Admin' here
    enum: ['jobseeker', 'recruiter', 'Admin'], 
    required: true,
  },
profilePic: {
  type: String,
  default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
},
profilePicPublicId: {
  type: String,
  default: '', // empty means it's using the default image
},
resumeUrl: { type: String },
resumePublicId: { type: String }


});


module.exports = mongoose.model('User', userSchema);
