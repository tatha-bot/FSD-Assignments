const Job = require("../models/Job");
const { getStatus } = require("../config/db");
const memoryStore = require("../data/memoryStore");
const sampleJobs = require("../data/seedData");

// @desc    Get all jobs / vacancies with filtering and search
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { search, category, jobType, location, status } = req.query;

    if (!getStatus()) {
      const jobs = memoryStore.getJobs({ search, category, jobType, location });
      return res.status(200).json({
        success: true,
        source: "memory-store",
        count: jobs.length,
        data: jobs,
      });
    }

    // MongoDB Mongoose query
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (jobType && jobType !== "All") {
      query.jobType = jobType;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (status) {
      query.status = status;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      source: "mongodb",
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Error in getJobs:", error);
    res.status(500).json({ success: false, message: "Server error retrieving jobs", error: error.message });
  }
};

// @desc    Get single job vacancy by ID
// @route   GET /api/jobs/:id
exports.getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!getStatus()) {
      const job = memoryStore.getJobById(id);
      if (!job) {
        return res.status(404).json({ success: false, message: "Job vacancy not found" });
      }
      return res.status(200).json({ success: true, data: job });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job vacancy not found" });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    console.error("Error in getJobById:", error);
    res.status(500).json({ success: false, message: "Server error retrieving job", error: error.message });
  }
};

// @desc    Create a new job vacancy
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      jobType,
      category,
      experienceLevel,
      salary,
      vacanciesCount,
      description,
      requirements,
      benefits,
      contactEmail,
    } = req.body;

    if (!title || !company || !location || !description || !contactEmail) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (title, company, location, description, contactEmail)",
      });
    }

    const payload = {
      title,
      company,
      location,
      jobType: jobType || "Full-time",
      category: category || "Engineering",
      experienceLevel: experienceLevel || "Mid-level",
      salary: salary || "Competitive",
      vacanciesCount: Number(vacanciesCount) || 1,
      description,
      requirements: requirements || "",
      benefits: benefits || "",
      contactEmail,
      status: "Open",
    };

    if (!getStatus()) {
      const newJob = memoryStore.createJob(payload);
      return res.status(201).json({ success: true, message: "Job vacancy created successfully", data: newJob });
    }

    const newJob = await Job.create(payload);
    res.status(201).json({ success: true, message: "Job vacancy created successfully", data: newJob });
  } catch (error) {
    console.error("Error in createJob:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update an existing job vacancy
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!getStatus()) {
      const updated = memoryStore.updateJob(id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
      return res.status(200).json({ success: true, message: "Job updated successfully", data: updated });
    }

    const updated = await Job.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, message: "Job updated successfully", data: updated });
  } catch (error) {
    console.error("Error in updateJob:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job vacancy
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!getStatus()) {
      const success = memoryStore.deleteJob(id);
      if (!success) {
        return res.status(404).json({ success: false, message: "Job not found" });
      }
      return res.status(200).json({ success: true, message: "Job vacancy deleted successfully" });
    }

    const deleted = await Job.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, message: "Job vacancy deleted successfully" });
  } catch (error) {
    console.error("Error in deleteJob:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset / Seed Sample Jobs
// @route   POST /api/jobs/seed
exports.seedJobs = async (req, res) => {
  try {
    if (!getStatus()) {
      const seeded = memoryStore.resetSeed();
      return res.status(200).json({
        success: true,
        message: "Sample vacancies seeded successfully into in-memory store",
        count: seeded.length,
        data: seeded,
      });
    }

    await Job.deleteMany({});
    const created = await Job.insertMany(sampleJobs);
    res.status(200).json({
      success: true,
      message: "Sample vacancies seeded successfully into MongoDB",
      count: created.length,
      data: created,
    });
  } catch (error) {
    console.error("Error in seedJobs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
