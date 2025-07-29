const Job = require('../models/Jobs.js');

const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (!job.recruiter || job.recruiter.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getAllJobs = async (req, res) => {
  try {
    const { category, location } = req.query;

    const filter = {};
    if (category) filter.category = { $regex: new RegExp(category, 'i') };
    if (location) filter.location = { $regex: new RegExp(location, 'i') };

   
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
      companyId: req.user.id, 
    });

   
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




module.exports = {
  getAllJobs,
  createJob,
  getMyJobs,
  updateJob,
  deleteJob,
  getSingleJob

};