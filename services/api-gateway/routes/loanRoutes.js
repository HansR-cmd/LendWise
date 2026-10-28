const express = require("express");
const router = express.Router();

const {
  createLoanApplication,
  getLoanApplications
} = require("../controllers/loanController");

router.post("/", createLoanApplication);
router.get("/", getLoanApplications);

module.exports = router;