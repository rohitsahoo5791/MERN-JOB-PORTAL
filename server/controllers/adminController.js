// backend/controllers/adminController.js
const jwt = require('jsonwebtoken'); 

const User = require('../models/user.js');
const Job = require('../models/Jobs.js');
const Application = require('../models/Application.js');



exports.adminLogin = (req, res) => {
    const { email, password } = req.body;

    // 1. Compare credentials against the .env variables
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        
        // 2. If they match, create a special JWT
        const payload = {
            // We can add a generic ID or just the role
            id: 'admin_user', 
            role: 'Admin' // Manually set the role here
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

        return res.status(200).json({ success: true, token });

    } else {
        // 3. If they don't match, send a generic "invalid credentials" error
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
};

// --- User Management ---

// API 1: Get All Jobseekers
exports.getAllJobseekers = async (req, res) => {
    try {
        const jobseekers = await User.find({ role: 'jobseeker' }).select('-password');
        res.status(200).json({ success: true, users: jobseekers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API 2: Get All Recruiters
exports.getAllRecruiters = async (req, res) => {
    try {
        const recruiters = await User.find({ role: 'recruiter' }).select('-password');
        res.status(200).json({ success: true, users: recruiters });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API 3: Delete a User
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        // Optional: Delete related jobs or applications here if needed
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// --- Expanded Views ---

// API 4: Get a Jobseeker's Applications
exports.getJobseekerApplications = async (req, res) => {
    try {
        const applications = await Application.find({ applicantId: req.params.userId }).populate('jobId', 'title');
        res.status(200).json({ success: true, applications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API 5: Delete a Specific Application
exports.deleteApplication = async (req, res) => {
    try {
        const application = await Application.findByIdAndDelete(req.params.applicationId);
        if (!application) return res.status(404).json({ success: false, message: "Application not found" });
        res.status(200).json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API 6: Get a Recruiter's Jobs
exports.getRecruiterJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ companyId: req.params.userId });
        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API 7: Delete a Specific Job
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.jobId);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });
        // Optional: Delete related applications as well
        await Application.deleteMany({ jobId: req.params.jobId });
        res.status(200).json({ success: true, message: "Job and related applications deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// --- "Latest Things" ---

// API 8: Get Latest Signed-Up Users
exports.getLatestUsers = async (req, res) => {
    try {
        const latestUsers = await User.find().sort({ createdAt: -1 }).limit(10).select('-password');
        res.status(200).json({ success: true, users: latestUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// API 9: Get Latest Job Posts
exports.getLatestJobs = async (req, res) => {
    try {
        const latestJobs = await Job.find().sort({ createdAt: -1 }).limit(10).populate('companyId', 'name');
        res.status(200).json({ success: true, jobs: latestJobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};