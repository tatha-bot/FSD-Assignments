const express = require("express");
const router = express.Router();
const { deposit, withdraw, getTransactions } = require("../controllers/transactionController");

router.route("/").get(getTransactions);
router.route("/deposit").post(deposit);
router.route("/withdraw").post(withdraw);

module.exports = router;
