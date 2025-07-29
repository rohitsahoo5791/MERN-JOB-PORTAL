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



router.get('/all', getAllJobs);



router.get(
    '/my-jobs',
    verifyToken,
    restrictTo('recruiter'), // Ensure only recruiters can access
    getMyJobs
);


router.post(
    '/', // This maps to POST /api/jobs
    verifyToken,
    restrictTo('recruiter'),
    createJob
);


router.put(
    '/edit/:jobId',
    verifyToken,
    restrictTo('recruiter'), // You could argue only the owner should edit, which the controller checks. This adds an extra layer.
    updateJob
);

// router.get(
//   '/edit/:jobId',
//   verifyToken,
//   restrictTo('recruiter'),
//   getSingleJob
// );

router.get('/edit/:jobId', verifyToken, (req, res) => {
  res.json({
    message: 'Token verified!',
    user: req.user,
  });
  getSingleJob
});


router.delete(
    '/delete/:jobId',
    verifyToken,
    restrictTo('recruiter'),
    deleteJob
);

module.exports = router;