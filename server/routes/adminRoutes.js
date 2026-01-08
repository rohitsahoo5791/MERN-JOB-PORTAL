const express = require('express');
const router = express.Router();

// --- Step 1: Import all necessary functions ---

// Import the security middleware
// Note: You might need to adjust the path to your 'auth.js' file
const { verifyToken } = require('../middleware/authMiddleware.js'); 
const { isAdmin } = require('../middleware/adminMiddleWare.js'); // Import our new middleware

// Import all the controller functions that will handle the logic for these routes
const {
    getAllJobseekers,
    getAllRecruiters,
    deleteUser,
    getJobseekerApplications,
    deleteApplication,
    getRecruiterJobs,
    deleteJob,
    getLatestUsers,
    getLatestJobs,
    adminLogin
} = require('../controllers/adminController.js'); // Adjust path if needed

// --- Step 2: Apply middleware to all routes in this file ---
// This is an efficient way to protect all endpoints defined below.
// Any request to a route in this file must first pass 'isAuthenticated', then 'isAdmin'.
router.use(verifyToken, isAdmin);


// --- Step 3: Define the specific routes for the admin panel ---

// === Main User Management Routes ===
/**
 * @openapi
 * /api/admin/users/jobseekers:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all jobseekers (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of jobseeker users
 */
router.get('/users/jobseekers', getAllJobseekers);

/**
 * @openapi
 * /api/admin/users/recruiters:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all recruiters (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of recruiter users
 */
router.get('/users/recruiters', getAllRecruiters);

/**
 * @openapi
 * /api/admin/users/{userId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a user by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete('/users/:userId', deleteUser);

// === Expanded View Routes (for when an admin clicks "expand" on a user) ===
/**
 * @openapi
 * /api/admin/applications/user/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get applications submitted by a specific user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of applications
 */
router.get('/applications/user/:userId', getJobseekerApplications);

/**
 * @openapi
 * /api/admin/applications/{applicationId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete an application by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Application deleted
 */
router.delete('/applications/:applicationId', deleteApplication);

/**
 * @openapi
 * /api/admin/jobs/recruiter/{userId}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get jobs posted by a recruiter (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Array of jobs
 */
router.get('/jobs/recruiter/:userId', getRecruiterJobs);

/**
 * @openapi
 * /api/admin/jobs/{jobId}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete a job by ID (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Job deleted
 */
router.delete('/jobs/:jobId', deleteJob);

// === "Latest Things" Routes (for the dashboard widgets) ===
/**
 * @openapi
 * /api/admin/users/latest:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get latest registered users (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of latest users
 */
router.get('/users/latest', getLatestUsers);

/**
 * @openapi
 * /api/admin/jobs/latest:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get latest jobs (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of latest jobs
 */
router.get('/jobs/latest', getLatestJobs);

// --- Step 4: Export the router ---


/**
 * @openapi
 * /api/admin/admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Admin logged in (returns token)
 */
router.post('/admin/login', adminLogin);
module.exports = router;