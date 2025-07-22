const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  updateProfile,
  updateResume,
  updateUserInfo,
  getCurrentUser
} = require('../controllers/authController');

const {
  uploadProfilePic,
  uploadResume
} = require('../middleware/upload');

const verifyToken = require('../middleware/authMiddleware');

// 🟢 Registration with profile picture
router.post('/register', uploadProfilePic.single('profilePic'), register);

// 🟢 Login and Logout
router.post('/login', login);
router.post('/logout', logout);

// 🟢 Get logged-in user info
router.get('/me', verifyToken, getCurrentUser);

// 🟢 Profile update (with optional profile picture)
router.put('/update-profile', verifyToken, uploadProfilePic.single('profilePic'), updateProfile);

// 🟢 Resume upload/update
router.put('/upload-resume', verifyToken, uploadResume.single('resume'), updateResume);

// 🟢 Update basic user info (name, email)
router.put('/update-info', verifyToken, updateUserInfo);

module.exports = router;
