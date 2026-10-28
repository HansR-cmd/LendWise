
const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    loanAmount: {
      type: Number,
      required: true,
      min: 1
    },
    annualIncome: {
      type: Number,
      required: true,
      min: 1
    },
    creditScore: {
      type: Number,
      required: true,
      min: 300,
      max: 900
    },
    loanTenureMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 360
    },
    purpose: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "LoanApplication",
  loanApplicationSchema
);
    