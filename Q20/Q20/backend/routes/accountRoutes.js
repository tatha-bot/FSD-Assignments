const express = require("express");
const router = express.Router();
const {
  getAccounts,
  getAccountByNumber,
  createAccount,
  verifyHolder,
  updateAccountStatus,
  resetDemo,
} = require("../controllers/accountController");

router.route("/").get(getAccounts).post(createAccount);
router.route("/verify-holder").post(verifyHolder);
router.route("/reset").post(resetDemo);
router.route("/:accountNumber").get(getAccountByNumber);
router.route("/:accountNumber/status").patch(updateAccountStatus);

module.exports = router;
