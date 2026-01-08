const Application = require('../models/Application.js');
const Job = require('../models/Jobs.js');
const User = require('../models/user.js'); 


exports.postApplication = async (req, res, next) => {
  try {
    // Check if the user object from the token exists and has the necessary properties.
    if (!req.user || !req.user.id || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication error: Token is missing user ID or role. Please log in again."
      });
    }

    // --- THE KEY CHANGE IS HERE ---
    // 1. Read the 'role' property from the token.
    const userRole = req.user.role;
    // 2. Read the 'id' property from the token and assign it to applicantId.
    const applicantId = req.user.id;
    // ----------------------------

    // Use the role from the token to perform the check.
    if (userRole !== 'jobseeker') {
      return res.status(403).json({ // 403 Forbidden is more appropriate here
        success: false,
        message: `Only users with the 'jobseeker' role may apply. Your role is '${userRole}'.`
      });
    }
    
    // The rest of the logic remains the same, as it now has the correct applicantId.
    const applicant = await User.findById(applicantId);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: `User not found. The database did not contain a user with the ID: ${applicantId}.`
      });
    }

    if (!applicant.resumeUrl || applicant.resumeUrl === '') {
      return res.status(400).json({
        success: false,
        message: "You must upload a resume to your profile before you can apply."
      });
    }

    const { jobId } = req.params;
    const jobDetails = await Job.findById(jobId);

    if (!jobDetails) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    const existingApplication = await Application.findOne({ jobId, applicantId });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job."
      });
    }

    const application = await Application.create({
      jobId,
      applicantId,
      recruiterId: jobDetails.companyId,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application,
    });

  } catch (error) {
    console.error("SERVER ERROR in postApplication:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getJobDetailsForApplicationPage = async (req, res, next) => {
    try {
        const { jobId } = req.params; // Get job ID from the URL

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).json({ success: false, message: "Job not found." });
        }

        res.status(200).json({
            success: true,
            job, // Send the full job object back
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ... existing imports

// ... your other controller functions (postApplication, etc.)

// --- ADD THIS NEW FUNCTION ---
exports.getMyApplications = async (req, res, next) => {
  try {
    const userId = req.user.id; // Get user ID from the token

    // Find all applications submitted by this user
    const applications = await Application.find({ applicantId: userId })
      .populate({
        path: 'jobId', // Populate the 'jobId' field in the Application model
        select: 'title category location companyId', // Select which fields from the Job model you need
        populate: {
          path: 'companyId', // Inside the Job model, populate the 'companyId' field
          select: 'name' // Only get the company's name
        }
      })
      .sort({ applicationDate: -1 }); // Show the most recent applications first

    res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {
    console.error("ERROR IN getMyApplications:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};