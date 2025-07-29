const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../utils/cloudinary');
const fs = require('fs');


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};


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



const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

  
    let profilePicUrl = "https://res.cloudinary.com/djpna2frt/image/upload/v1752238061/cld-sample-5.jpg"; // Default
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: "jobportal_profiles" });
      profilePicUrl = result.secure_url;
      fs.unlinkSync(req.file.path); 
    }

    
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profilePic: profilePicUrl,
    });


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




const login = async (req, res) => {
  const { email, password, role } = req.body; // ✅ Get role from frontend too

  try {
    // 1. Basic validation
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    // 2. Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // 3. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }

    // 4. Validate role match
    if (!user.role) {
      return res.status(500).json({ message: 'User role is missing. Please contact support.' });
    }

    if (user.role !== role) {
      return res.status(403).json({ message: `This user is not registered as a ${role}.` });
    }

    // 5. Create JWT token
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Sanitize and respond
    const sanitizedUser = createSanitizedUserObject(user);

    res.status(200).json({
      status: 'success',
      token,
      user: sanitizedUser,
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};




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



const updateUserInfo = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (email) user.email = email; 

    await user.save();

  
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



const getCurrentUser = async (req, res) => {
  try {
    // The user ID is added to req.user by your auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
   
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



const logout = (req, res) => {
 
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