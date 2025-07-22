const express = require('express');
const router = express.Router();

// 1. Import all necessary controllers and middleware ONCE at the top.
const {
  getAllJobs,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobController');

const verifyToken = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/restrictTo');


// --- Public Routes ---

// GET /api/jobs/all - This is the main route for fetching all jobs.
// It uses our new 'getAllJobs' controller which includes recruiter info.
router.get('/all', getAllJobs);


// --- Protected Recruiter Routes (all require a valid token and 'recruiter' role) ---

// GET /api/jobs/my-jobs - Get jobs posted by the logged-in recruiter.
router.get(
    '/my-jobs',
    verifyToken,
    restrictTo('recruiter'), // Ensure only recruiters can access
    getMyJobs
);

// POST /api/jobs - Create a new job posting.
router.post(
    '/', // This maps to POST /api/jobs
    verifyToken,
    restrictTo('recruiter'),
    createJob
);

// PUT /api/jobs/edit/:jobId - Update a specific job posting.
router.put(
    '/edit/:jobId',
    verifyToken,
    restrictTo('recruiter'), // You could argue only the owner should edit, which the controller checks. This adds an extra layer.
    updateJob
);

// DELETE /api/jobs/delete/:jobId - Delete a specific job posting.
router.delete(
    '/delete/:jobId',
    verifyToken,
    restrictTo('recruiter'),
    deleteJob
);

module.exports = router;