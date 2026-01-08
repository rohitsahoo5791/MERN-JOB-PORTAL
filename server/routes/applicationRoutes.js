const express = require('express');
const { postApplication,getJobDetailsForApplicationPage ,getMyApplications} = require('../controllers/applicationController.js');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();


/**
 * @openapi
 * /api/application/apply/{jobId}:
 *   post:
 *     tags:
 *       - Applications
 *     summary: Apply to a job (authenticated users)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Application submitted
 */
router.post('/apply/:jobId', verifyToken, postApplication);

/**
 * @openapi
 * /api/application/job-details/{jobId}:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get job details needed for application page
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
 *         description: Job details object
 */
router.get('/job-details/:jobId', verifyToken, getJobDetailsForApplicationPage);

/**
 * @openapi
 * /api/application/my-applications:
 *   get:
 *     tags:
 *       - Applications
 *     summary: Get applications submitted by the current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Array of application objects
 */
router.get('/my-applications', verifyToken, getMyApplications);

module.exports = router;