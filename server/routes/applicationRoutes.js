const express = require('express');
const { postApplication,getJobDetailsForApplicationPage ,getMyApplications} = require('../controllers/applicationController.js');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();


router.post('/apply/:jobId', verifyToken, postApplication);
router.get('/job-details/:jobId', verifyToken, getJobDetailsForApplicationPage);
router.get('/my-applications', verifyToken, getMyApplications);

module.exports = router;