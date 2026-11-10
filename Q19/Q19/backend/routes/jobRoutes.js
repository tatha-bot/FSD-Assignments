const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  seedJobs,
} = require("../controllers/jobController");

router.route("/").get(getJobs).post(createJob);
router.route("/seed").post(seedJobs);
router.route("/:id").get(getJobById).put(updateJob).delete(deleteJob);

module.exports = router;
