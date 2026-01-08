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
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profilePic:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered
 */
router.post('/register', uploadProfilePic.single('profilePic'), register);

// 🟢 Login and Logout
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Login successful (returns token)
 */
router.post('/login', login);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log out the current user
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', logout);

// 🟢 Get logged-in user info
/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User object
 *       401:
 *         description: Unauthorized
 */
router.get('/me', verifyToken, getCurrentUser);

// 🟢 Profile update (with optional profile picture)
/**
 * @openapi
 * /api/auth/update-profile:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update user profile (optional profile picture)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Profile updated
 */
router.put('/update-profile', verifyToken, uploadProfilePic.single('profilePic'), updateProfile);

// 🟢 Resume upload/update
/**
 * @openapi
 * /api/auth/upload-resume:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Upload or update resume
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               resume:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Resume uploaded
 */
router.put('/upload-resume', verifyToken, uploadResume.single('resume'), updateResume);

// 🟢 Update basic user info (name, email)
/**
 * @openapi
 * /api/auth/update-info:
 *   put:
 *     tags:
 *       - Auth
 *     summary: Update basic user info
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User info updated
 */
router.put('/update-info', verifyToken, updateUserInfo);

module.exports = router;
