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
router.get('/users/jobseekers', getAllJobseekers);
router.get('/users/recruiters', getAllRecruiters);
router.delete('/users/:userId', deleteUser);

// === Expanded View Routes (for when an admin clicks "expand" on a user) ===
router.get('/applications/user/:userId', getJobseekerApplications);
router.delete('/applications/:applicationId', deleteApplication);
router.get('/jobs/recruiter/:userId', getRecruiterJobs);
router.delete('/jobs/:jobId', deleteJob);

// === "Latest Things" Routes (for the dashboard widgets) ===
router.get('/users/latest', getLatestUsers);
router.get('/jobs/latest', getLatestJobs);

// --- Step 4: Export the router ---


router.post('/admin/login', adminLogin);
module.exports = router;