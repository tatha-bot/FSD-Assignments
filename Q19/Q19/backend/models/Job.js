const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    jobType: {
      type: String,
      required: [true, "Job type is required"],
      enum: ["Full-time", "Part-time", "Contract", "Remote", "Internship"],
      default: "Full-time",
    },
    category: {
      type: String,
      required: [true, "Job category is required"],
      enum: ["Engineering", "Design", "Marketing", "Product", "Sales", "Support", "Other"],
      default: "Engineering",
    },
    experienceLevel: {
      type: String,
      default: "Mid-level",
    },
    salary: {
      type: String,
      default: "Competitive / Negotiable",
    },
    vacanciesCount: {
      type: Number,
      required: [true, "Number of vacancies is required"],
      min: [1, "Must have at least 1 vacancy"],
      default: 1,
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    requirements: {
      type: String,
      default: "",
    },
    benefits: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      required: [true, "Contact email is required"],
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    status: {
      type: String,
      enum: ["Open", "Closed"],
      default: "Open",
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual index for searching
jobSchema.index({ title: "text", company: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);
