const Application = require("../models/Application");
const Job = require("../models/Job");
const { getStatus } = require("../config/db");
const memoryStore = require("../data/memoryStore");

// @desc    Apply for a job vacancy
// @route   POST /api/applications
exports.applyForJob = async (req, res) => {
  try {
    const {
      jobId,
      applicantName,
      applicantEmail,
      phone,
      experienceYears,
      resumeLink,
      portfolioUrl,
      coverLetter,
    } = req.body;

    if (!jobId || !applicantName || !applicantEmail || !phone || experienceYears === undefined || !resumeLink) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required application details (jobId, name, email, phone, experience, resume link)",
      });
    }

    const payload = {
      jobId,
      applicantName,
      applicantEmail,
      phone,
      experienceYears: Number(experienceYears) || 0,
      resumeLink,
      portfolioUrl: portfolioUrl || "",
      coverLetter: coverLetter || "",
      status: "Pending",
    };

    if (!getStatus()) {
      const job = memoryStore.getJobById(jobId);
      if (!job) {
        return res.status(404).json({ success: false, message: "The specified job vacancy was not found" });
      }
      if (job.status === "Closed") {
        return res.status(400).json({ success: false, message: "This vacancy is currently closed for applications" });
      }

      const application = memoryStore.createApplication(payload);
      return res.status(201).json({
        success: true,
        message: "Application submitted successfully! The recruiter will review your profile.",
        data: application,
      });
    }

    // MongoDB Mongoose flow
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "The specified job vacancy was not found" });
    }
    if (job.status === "Closed") {
      return res.status(400).json({ success: false, message: "This vacancy is currently closed for applications" });
    }

    const application = await Application.create(payload);

    // Increment applications count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationsCount: 1 } });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully! The recruiter will review your profile.",
      data: application,
    });
  } catch (error) {
    console.error("Error in applyForJob:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get applications (all or filtered by jobId)
// @route   GET /api/applications
exports.getApplications = async (req, res) => {
  try {
    const { jobId } = req.query;

    if (!getStatus()) {
      const applications = memoryStore.getApplications(jobId);
      return res.status(200).json({
        success: true,
        count: applications.length,
        data: applications,
      });
    }

    let filter = {};
    if (jobId) filter.jobId = jobId;

    const applications = await Application.find(filter)
      .populate("jobId", "title company location vacanciesCount")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Error in getApplications:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application review status
// @route   PATCH /api/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["Pending", "Reviewed", "Shortlisted", "Interview", "Hired", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(", ")}`,
      });
    }

    if (!getStatus()) {
      const updated = memoryStore.updateApplicationStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Application not found" });
      }
      return res.status(200).json({
        success: true,
        message: `Application marked as ${status}`,
        data: updated,
      });
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.status(200).json({
      success: true,
      message: `Application marked as ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error("Error in updateApplicationStatus:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
