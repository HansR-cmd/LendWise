
const LoanApplication = require("../models/loanApplication.js");
const calculateEMI = require("../utils/emiCalculator");
const getRecommendations = require("../utils/recommendationEngine");

// Create a loan application
const createLoanApplication = async (req, res) => {
  try {
    const {
      userId,
      loanAmount,
      annualIncome,
      creditScore,
      loanTenureMonths,
      purpose
    } = req.body;

    // Save the application to MongoDB
    const application = await LoanApplication.create({
      userId,
      loanAmount,
      annualIncome,
      creditScore,
      loanTenureMonths,
      purpose
    });

    // Calculate EMI using a temporary 10% annual interest rate
    const estimatedEMI = calculateEMI(
      loanAmount,
      10,
      loanTenureMonths
    );

    const totalRepayment = Number(
      (estimatedEMI * loanTenureMonths).toFixed(2)
    );

    const totalInterest = Number(
      (totalRepayment - loanAmount).toFixed(2)
    );

    // Basic demonstration eligibility rules
    let eligibilityStatus = "Eligible";

    if (creditScore < 650 || annualIncome < 200000) {
      eligibilityStatus = "Not Eligible";
    } else if (creditScore < 700) {
      eligibilityStatus = "Needs Review";
    }

    // Find matching lenders
    const recommendations = getRecommendations({
      loanAmount,
      annualIncome,
      creditScore
    });

    // Return the complete result
    res.status(201).json({
      message: "Loan application submitted",
      application,
      estimatedEMI,
      totalRepayment,
      totalInterest,
      eligibilityStatus,
      recommendations
    });
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError"
    ) {
      return res.status(400).json({
        message: "Invalid loan application data",
        error: error.message
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};

// Get all loan applications
const getLoanApplications = async (req, res) => {
  try {
    const applications = await LoanApplication.find()
      .populate("userId", "name email");

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createLoanApplication,
  getLoanApplications
};
