const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantName: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true,
    },
    applicantEmail: {
      type: String,
      required: [true, "Applicant email is required"],
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please enter a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: [true, "Years of experience is required"],
      min: 0,
    },
    resumeLink: {
      type: String,
      required: [true, "Resume URL / portfolio is required"],
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
      default: "",
    },
    coverLetter: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Shortlisted", "Interview", "Hired", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Application", applicationSchema);
