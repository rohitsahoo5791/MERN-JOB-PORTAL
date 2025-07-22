const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');

// --- Helper function to sign JWT ---
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// --- Helper function to create a clean user object for responses ---
const createSanitizedUserObject = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic,
    resumeUrl: user.resumeUrl,
  };
};


/**
 * @desc    Register new user, upload profile pic, and log them in
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    // 2. Handle profile picture upload
    let profilePicUrl = "https://res.cloudinary.com/djpna2frt/image/upload/v1752238061/cld-sample-5.jpg"; // Default
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "jobportal_profiles" });
      profilePicUrl = result.secure_url;
      fs.unlinkSync(req.file.path); // Clean up local temp file
    }

    // 3. Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: profilePicUrl,
    });

    // 4. FIX: Log the user in immediately after registration for better UX
    const token = signToken(user._id);
    const sanitizedUser = createSanitizedUserObject(user);

    res.status(201).json({
      status: 'success',
      token,
      user: sanitizedUser,
    });

  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};


/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // 1. Find user and their password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // 2. Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // 3. Create JWT token
     const token = jwt.sign(
    { id: user._id, role: user.role }, // Payload MUST contain 'id' and 'role'
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );


    // 4. FIX: Send a consistent, clean user object
    const sanitizedUser = createSanitizedUserObject(user);

    res.status(200).json({
      status: 'success',
      token,
      user: sanitizedUser,
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};


/**
 * @desc    Update user's profile picture
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }
    
    const user = await User.findById(req.user.id);

    // Delete previous Cloudinary image if it exists and is not the default one
    if (user.profilePicPublicId) {
      await cloudinary.uploader.destroy(user.profilePicPublicId);
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, { folder: "jobportal_profiles" });
    fs.unlinkSync(req.file.path); // Clean up

    user.profilePic = result.secure_url;
    user.profilePicPublicId = result.public_id;
    await user.save();

    // 5. FIX: Return the entire updated user object for Redux state consistency
    const sanitizedUser = createSanitizedUserObject(user);
    res.status(200).json({
      status: 'success',
      message: 'Profile picture updated successfully.',
      user: sanitizedUser,
    });

  } catch (err) {
    console.error("Update profile picture error:", err);
    res.status(500).json({ message: 'Failed to update profile picture.' });
  }
};


/**
 * @desc    Upload or update user's resume
 * @route   PUT /api/auth/upload-resume
 * @access  Private
 */
const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const user = await User.findById(req.user.id);

    // Delete old resume from Cloudinary if it exists
    if (user.resumePublicId) {
      await cloudinary.uploader.destroy(user.resumePublicId, { resource_type: "raw" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "jobportal_resumes",
      resource_type: "raw"
    });
    fs.unlinkSync(req.file.path); // Clean up

    user.resumeUrl = result.secure_url;
    user.resumePublicId = result.public_id;
    await user.save();

    // 6. FIX: Return the entire updated user object
    const sanitizedUser = createSanitizedUserObject(user);
    res.status(200).json({
      status: 'success',
      message: 'Resume uploaded successfully.',
      user: sanitizedUser,
    });

  } catch (err) {
    console.error("Resume Upload Error:", err);
    res.status(500).json({ message: 'Resume upload failed.' });
  }
};


/**
 * @desc    Update user's name and email
 * @route   PUT /api/users/update-info
 * @access  Private
 */
const updateUserInfo = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email; // You might want to check if the new email already exists

    await user.save();

    // 7. FIX: Send a consistent success response with the updated user object
    const sanitizedUser = createSanitizedUserObject(user);
    res.status(200).json({
      status: 'success',
      message: "Profile info updated.",
      user: sanitizedUser,
    });

  } catch (err) {
    console.error("Update profile info error:", err);
    res.status(500).json({ message: "Failed to update profile info." });
  }
};


/**
 * @desc    Get the currently logged-in user's data
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = async (req, res) => {
  try {
    // The user ID is added to req.user by your auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // 8. FIX: Send a consistent user object
    const sanitizedUser = createSanitizedUserObject(user);
    res.status(200).json({
      status: 'success',
      user: sanitizedUser,
    });

  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};


/**
 * @desc    Logout user (stateless)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = (req, res) => {
  // For JWT, logout is handled client-side by deleting the token.
  // This endpoint is here for completeness.
  res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
};


module.exports = {
  register,
  login,
  updateProfile,
  updateResume,
  updateUserInfo,
  logout,
  getCurrentUser,
};