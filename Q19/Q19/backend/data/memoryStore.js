const sampleJobs = require("./seedData");

let inMemoryJobs = sampleJobs.map((j, index) => ({
  _id: `mockjob_${index + 1}`,
  ...j,
  applicationsCount: 0,
  createdAt: new Date(Date.now() - (index * 86400000 * 2)).toISOString(),
  updatedAt: new Date().toISOString(),
}));

let inMemoryApplications = [];

const memoryStore = {
  getJobs: ({ search, category, jobType, location }) => {
    let list = [...inMemoryJobs];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q)
      );
    }

    if (category && category !== "All") {
      list = list.filter((j) => j.category.toLowerCase() === category.toLowerCase());
    }

    if (jobType && jobType !== "All") {
      list = list.filter((j) => j.jobType.toLowerCase() === jobType.toLowerCase());
    }

    if (location) {
      list = list.filter((j) => j.location.toLowerCase().includes(location.toLowerCase()));
    }

    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getJobById: (id) => {
    return inMemoryJobs.find((j) => String(j._id) === String(id)) || null;
  },

  createJob: (jobData) => {
    const newJob = {
      _id: `mockjob_${Date.now()}`,
      ...jobData,
      vacanciesCount: Number(jobData.vacanciesCount) || 1,
      applicationsCount: 0,
      status: jobData.status || "Open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryJobs.unshift(newJob);
    return newJob;
  },

  updateJob: (id, updateData) => {
    const index = inMemoryJobs.findIndex((j) => String(j._id) === String(id));
    if (index === -1) return null;
    inMemoryJobs[index] = {
      ...inMemoryJobs[index],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    return inMemoryJobs[index];
  },

  deleteJob: (id) => {
    const index = inMemoryJobs.findIndex((j) => String(j._id) === String(id));
    if (index === -1) return false;
    inMemoryJobs.splice(index, 1);
    inMemoryApplications = inMemoryApplications.filter((a) => String(a.jobId) !== String(id));
    return true;
  },

  resetSeed: () => {
    inMemoryJobs = sampleJobs.map((j, index) => ({
      _id: `mockjob_${index + 1}`,
      ...j,
      applicationsCount: 0,
      createdAt: new Date(Date.now() - (index * 86400000 * 2)).toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    inMemoryApplications = [];
    return inMemoryJobs;
  },

  createApplication: (appData) => {
    const newApp = {
      _id: `mockapp_${Date.now()}`,
      ...appData,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    inMemoryApplications.unshift(newApp);

    // Increment applications count on job
    const job = inMemoryJobs.find((j) => String(j._id) === String(appData.jobId));
    if (job) {
      job.applicationsCount = (job.applicationsCount || 0) + 1;
    }

    return newApp;
  },

  getApplications: (jobId = null) => {
    if (jobId) {
      return inMemoryApplications.filter((a) => String(a.jobId) === String(jobId));
    }
    return [...inMemoryApplications];
  },

  updateApplicationStatus: (id, status) => {
    const app = inMemoryApplications.find((a) => String(a._id) === String(id));
    if (!app) return null;
    app.status = status;
    app.updatedAt = new Date().toISOString();
    return app;
  },
};

module.exports = memoryStore;
