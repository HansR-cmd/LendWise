
const express = require("express");
const router = express.Router();

const getRecommendations = require("../utils/recommendationEngine");

router.post("/", (req, res) => {
  try {
    const {
      loanType,
      loanAmount,
      annualIncome,
      monthlyIncome,
      monthlyExpenses,
      existingEMIs,
      monthlyBusinessCashFlow,
      creditScore,
      loanTenureMonths,
    } = req.body;

    const isValidNumber = (value) =>
      typeof value === "number" && Number.isFinite(value);

    if (
      !["personal", "business"].includes(loanType) ||
      !isValidNumber(loanAmount) ||
      loanAmount <= 0 ||
      !isValidNumber(annualIncome) ||
      annualIncome <= 0 ||
      !isValidNumber(monthlyIncome) ||
      monthlyIncome <= 0 ||
      !isValidNumber(monthlyExpenses) ||
      monthlyExpenses < 0 ||
      !isValidNumber(existingEMIs) ||
      existingEMIs < 0 ||
      (loanType === "business" &&
        (!isValidNumber(monthlyBusinessCashFlow) ||
          monthlyBusinessCashFlow <= 0)) ||
      !isValidNumber(creditScore) ||
      creditScore < 300 ||
      creditScore > 900 ||
      !isValidNumber(loanTenureMonths) ||
      !Number.isInteger(loanTenureMonths) ||
      loanTenureMonths <= 0
    ) {
      return res.status(400).json({
        message: "Please check your loan type and financial inputs.",
      });
    }

    const result = getRecommendations({
      loanType,
      loanAmount,
      annualIncome,
      monthlyIncome,
      monthlyExpenses,
      existingEMIs,
      monthlyBusinessCashFlow,
      creditScore,
      loanTenureMonths,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Recommendation error:", error);

    return res.status(500).json({
      message: "Unable to generate loan recommendations.",
    });
  }
});

module.exports = router;
