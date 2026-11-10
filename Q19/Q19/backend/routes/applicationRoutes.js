const express = require("express");
const router = express.Router();
const {
  applyForJob,
  getApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.route("/").get(getApplications).post(applyForJob);
router.route("/:id/status").patch(updateApplicationStatus);

module.exports = router;
