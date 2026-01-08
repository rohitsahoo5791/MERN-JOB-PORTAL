const express = require('express');
const router = express.Router();


const {
  getAllJobs,
  createJob,
  getMyJobs,
  updateJob,
  getSingleJob,
  deleteJob,
} = require('../controllers/jobController');

const verifyToken = require('../middleware/authMiddleware');
const restrictTo = require('../middleware/restrictTo');



/**
 * @openapi
 * /api/jobs/all:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Retrieve all jobs
 *     description: Returns a list of all job postings.
 *     responses:
 *       200:
 *         description: A JSON array of job objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */
router.get('/all', getAllJobs);



router.get(
    '/my-jobs',
    verifyToken,
    restrictTo('recruiter'), // Ensure only recruiters can access
    getMyJobs
);

/**
 * @openapi
 * /api/jobs/my-jobs:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Retrieve jobs created by the authenticated recruiter
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A JSON array of job objects belonging to the recruiter
 *       401:
 *         description: Unauthorized
 */


router.post(
    '/', // This maps to POST /api/jobs
    verifyToken,
    restrictTo('recruiter'),
    createJob
);

/**
 * @openapi
 * /api/jobs:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Create a new job (recruiter only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Job created
 *       401:
 *         description: Unauthorized
 */


router.put(
    '/edit/:jobId',
    verifyToken,
    restrictTo('recruiter'), // You could argue only the owner should edit, which the controller checks. This adds an extra layer.
    updateJob
);

/**
 * @openapi
 * /api/jobs/edit/{jobId}:
 *   put:
 *     tags:
 *       - Jobs
 *     summary: Update a job by ID (recruiter only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job updated
 *       401:
 *         description: Unauthorized
 */

// router.get(
//   '/edit/:jobId',
//   verifyToken,
//   restrictTo('recruiter'),
//   getSingleJob
// );

/**
 * @openapi
 * /api/jobs/edit/{jobId}:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Retrieve a single job by ID (authenticated)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job object
 *       401:
 *         description: Unauthorized
 */
router.get('/edit/:jobId', verifyToken, getSingleJob);


router.delete(
    '/delete/:jobId',
    verifyToken,
    restrictTo('recruiter'),
    deleteJob
);

/**
 * @openapi
 * /api/jobs/delete/{jobId}:
 *   delete:
 *     tags:
 *       - Jobs
 *     summary: Delete a job by ID (recruiter only)
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
 *       401:
 *         description: Unauthorized
 */

module.exports = router;