const Job = require('../models/Jobs.js');

/**
 * @desc    Get all jobs, with optional filtering by category/location.
 *          This also populates recruiter info for the job cards.
 * @route   GET /api/jobs/all
 * @access  Public
 */
const getAllJobs = async (req, res) => {
  try {
    const { category, location } = req.query;

    const filter = {};
    if (category) filter.category = { $regex: new RegExp(category, 'i') };
    if (location) filter.location = { $regex: new RegExp(location, 'i') };

    // FIX: Populate recruiter info here so the job cards have company details
    const jobs = await Job.find(filter)
      .populate({
        path: 'companyId',
        select: 'name email profilePic role', // Select only the necessary recruiter info
      })
      .sort({ createdAt: -1 });

    res.status(200).json(jobs); // Send the array directly

  } catch (error) {
    console.error('Error fetching all jobs:', error);
    res.status(500).json({ message: 'Server error while fetching jobs.' });
  }
};

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private (Recruiter only)
 */
const createJob = async (req, res) => {
  try {
    const { title, description, location, category, salary } = req.body;
    
    // Create and save the new job, linking it to the logged-in recruiter
    const newJob = await Job.create({
      title,
      description,
      location,
      category,
      salary,
      companyId: req.user.id, // Comes from your auth middleware
    });

    // FIX: Populate the new job with company info before sending it back
    const job = await Job.findById(newJob._id).populate({
      path: 'companyId',
      select: 'name email profilePic role',
    });

    // Your Redux thunk expects the created job object to be returned directly.
    res.status(201).json(job);

  } catch (error) {
    console.error('❌ Job Creation Error:', error);
    res.status(500).json({ message: 'Failed to create job.' });
  }
};

/**
 * @desc    Get all jobs posted by the logged-in recruiter
 * @route   GET /api/jobs/my-jobs
 * @access  Private (Recruiter only)
 */
const getMyJobs = async (req, res) => {
  try {
    // A role check in the route's middleware is cleaner, but this also works.
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: "Forbidden: Only recruiters can perform this action." });
    }

    const jobs = await Job.find({ companyId: req.user.id }).sort({ createdAt: -1 });
    
    // Your Redux thunk expects the array of jobs to be returned directly.
    res.status(200).json(jobs);

  } catch (err) {
    console.error("Error fetching user's jobs:", err);
    res.status(500).json({ message: 'Failed to fetch your jobs.' });
  }
};

/**
 * @desc    Update a job posting
 * @route   PUT /api/jobs/edit/:jobId
 * @access  Private (Recruiter only)
 */
const updateJob = async (req, res) => {
  const { jobId } = req.params;
  const recruiterId = req.user.id;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    // Ensure the person updating the job is the one who created it
    if (job.companyId.toString() !== recruiterId) {
      return res.status(403).json({ message: 'Unauthorized to edit this job.' });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { $set: req.body },
      { new: true, runValidators: true } // 'new: true' returns the updated doc
    ).populate({
      path: 'companyId',
      select: 'name email profilePic role',
    });

    // Your Redux thunk expects the updated job object to be returned directly.
    res.status(200).json(updatedJob);

  } catch (err) {
    console.error('Update Job Error:', err);
    res.status(500).json({ message: 'Failed to update job.' });
  }
};

/**
 * @desc    Delete a job posting
 * @route   DELETE /api/jobs/delete/:jobId
 * @access  Private (Recruiter only)
 */
const deleteJob = async (req, res) => {
  const { jobId } = req.params;
  const recruiterId = req.user.id;

  try {
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found.' });
    }
    if (job.companyId.toString() !== recruiterId) {
      return res.status(403).json({ message: 'Unauthorized to delete this job.' });
    }

    await job.deleteOne(); // Use the new Mongoose method

    // Your Redux thunk expects the jobId on success, so a simple success message is fine.
    res.status(200).json({ message: 'Job deleted successfully.' });

  } catch (err){
    console.error('Delete Job Error:', err);
    res.status(500).json({ message: 'Failed to delete job.' });
  }
};


// Note: getJobs was merged into getAllJobs with the populate fix.
// Note: getAllJobsWithRecruiters is now the default behavior of getAllJobs.
// Note: There was a duplicate updateJob in the original module.exports.

module.exports = {
  getAllJobs,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
};