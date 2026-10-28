const path = require("path");

const loanProducts = require(
  path.resolve(__dirname, "../../../data/loanProducts.js")
);
const demoLenders = require(
  path.resolve(__dirname, "../../../data/lenders.js")
);

function calculateLoanDetails(principal, annualRate, tenureMonths) {
  const monthlyRate = annualRate / 12 / 100;

  if (monthlyRate === 0) {
    const emi = principal / tenureMonths;

    return {
      monthlyEMI: Math.round(emi * 100) / 100,
      totalRepayment: Math.round(principal * 100) / 100,
      totalInterest: 0,
    };
  }

  const rateFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi =
    (principal * monthlyRate * rateFactor) / (rateFactor - 1);

  const totalRepayment = emi * tenureMonths;
  const totalInterest = totalRepayment - principal;

  return {
    monthlyEMI: Math.round(emi * 100) / 100,
    totalRepayment: Math.round(totalRepayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

function getRecommendations({
  loanType,
  loanAmount,
  annualIncome,
  monthlyIncome,
  monthlyExpenses,
  existingEMIs,
  monthlyBusinessCashFlow,
  creditScore,
  loanTenureMonths,
}) {
  const eligibleLenders = [];
  const ineligibleLenders = [];

  const personalAvailable =
    monthlyIncome - monthlyExpenses - existingEMIs;

  const businessAvailable =
    monthlyBusinessCashFlow - monthlyExpenses - existingEMIs;

  const availableForRepayment =
    loanType === "business" ? businessAvailable : personalAvailable;

  // Select candidates based on loanType:
  // For business loans: use verified products from loanProducts.js
  // For personal loans: use demoLenders (and any personal loans in loanProducts.js)
  // Prioritize verified products from loanProducts.js
  const verifiedProducts = loanProducts.filter(
    (product) => product.loanType === loanType
  );
  const candidateProducts =
    verifiedProducts.length > 0
      ? verifiedProducts
      : demoLenders.map((lender) => ({
        ...lender,
        loanType: "personal",
        isDemoRecord: true,
      }));
  for (const product of candidateProducts) {
    const reasons = [];

    // 1. Credit Score check (only if published/defined)
    if (
      typeof product.minCreditScore === "number" &&
      creditScore < product.minCreditScore
    ) {
      reasons.push(
        `Credit score must be at least ${product.minCreditScore}.`
      );
    }

    // 2. Annual Income check (only if published/defined)
    if (
      typeof product.minAnnualIncome === "number" &&
      annualIncome < product.minAnnualIncome
    ) {
      reasons.push(
        `Annual income must be at least ₹${product.minAnnualIncome.toLocaleString("en-IN")}.`
      );
    }

    // 3. Loan Amount checks
    if (
      typeof product.minLoanAmount === "number" &&
      loanAmount < product.minLoanAmount
    ) {
      reasons.push(
        `Requested loan amount is below the minimum limit of ₹${product.minLoanAmount.toLocaleString("en-IN")}.`
      );
    }

    if (
      typeof product.maxLoanAmount === "number" &&
      loanAmount > product.maxLoanAmount
    ) {
      reasons.push(
        `Requested loan amount exceeds the maximum limit of ₹${product.maxLoanAmount.toLocaleString("en-IN")}.`
      );
    }

    // 4. Tenure checks
    if (
      typeof product.minTenureMonths === "number" &&
      loanTenureMonths < product.minTenureMonths
    ) {
      reasons.push(
        `Requested tenure of ${loanTenureMonths} months is below the minimum tenure of ${product.minTenureMonths} months.`
      );
    }

    if (
      typeof product.maxTenureMonths === "number" &&
      loanTenureMonths > product.maxTenureMonths
    ) {
      reasons.push(
        `Requested tenure of ${loanTenureMonths} months exceeds the maximum tenure of ${product.maxTenureMonths} months.`
      );
    }

    // 5. Repayment & Affordability calculations
    let loanDetails = null;

    if (product.repaymentModel === "revolving_credit") {
      // Revolving credit facilities (e.g., Cash Credit / Overdraft) have no fixed EMI
      if (availableForRepayment <= 0) {
        reasons.push(
          "Your stated cash flow does not leave funds available for working capital repayment."
        );
      }
    } else {
      // Fixed-EMI term loans
      const baseRate =
        typeof product.interestRate === "number"
          ? product.interestRate
          : product.minInterestRate;

      if (typeof baseRate === "number") {
        const minEstimate = calculateLoanDetails(
          loanAmount,
          baseRate,
          loanTenureMonths
        );

        let maxEstimate = null;
        if (typeof product.maxInterestRate === "number") {
          maxEstimate = calculateLoanDetails(
            loanAmount,
            product.maxInterestRate,
            loanTenureMonths
          );
        }

        loanDetails = {
          monthlyEMI: minEstimate.monthlyEMI,
          maxMonthlyEMI: maxEstimate ? maxEstimate.monthlyEMI : minEstimate.monthlyEMI,
          totalInterest: minEstimate.totalInterest,
          maxTotalInterest: maxEstimate ? maxEstimate.totalInterest : minEstimate.totalInterest,
          totalRepayment: minEstimate.totalRepayment,
          maxTotalRepayment: maxEstimate ? maxEstimate.totalRepayment : minEstimate.totalRepayment,
          isRange: Boolean(maxEstimate && maxEstimate.monthlyEMI !== minEstimate.monthlyEMI),
        };

        if (availableForRepayment <= 0) {
          reasons.push(
            "Your stated income or business cash flow does not leave money available for a new loan payment after expenses and existing EMIs."
          );
        } else if (loanDetails.monthlyEMI > availableForRepayment) {
          reasons.push(
            `Estimated EMI starting at ₹${loanDetails.monthlyEMI.toLocaleString("en-IN")} exceeds the available monthly repayment capacity of ₹${Math.round(availableForRepayment).toLocaleString("en-IN")}.`
          );
        }
      }
    }

    // Check pass or fail
    if (reasons.length === 0) {
      const positiveReasons = [];
      if (typeof product.minCreditScore === "number") {
        positiveReasons.push("Credit score meets the listed minimum.");
      }
      if (typeof product.minAnnualIncome === "number") {
        positiveReasons.push("Annual income meets the listed minimum.");
      }
      if (
        typeof product.minLoanAmount === "number" ||
        typeof product.maxLoanAmount === "number"
      ) {
        positiveReasons.push("Requested amount fits within listed limits.");
      }
      if (product.repaymentModel === "revolving_credit") {
        positiveReasons.push(
          "Working capital facility suitable for flexible cash flow management."
        );
      } else if (loanDetails) {
        positiveReasons.push(
          "Estimated repayment fits within your stated monthly repayment capacity."
        );
      }

      eligibleLenders.push({
        ...product,
        eligibilityStatus:
          "Passes listed checks; lender approval is not guaranteed",
        reasons: positiveReasons,
        affordability: {
          availableMonthlyRepayment:
            Math.round(availableForRepayment * 100) / 100,
          estimatedEMI: loanDetails ? loanDetails.monthlyEMI : null,
          remainingAfterEMI: loanDetails
            ? Math.round((availableForRepayment - loanDetails.monthlyEMI) * 100) / 100
            : Math.round(availableForRepayment * 100) / 100,
        },
        loanDetails,
      });
    } else {
      ineligibleLenders.push({
        ...product,
        eligibilityStatus: "Does not pass one or more listed checks",
        reasons,
        ...(loanDetails ? { loanDetails } : {}),
      });
    }
  }

  // Sort eligible lenders by total repayment where applicable
  eligibleLenders.sort((a, b) => {
    if (a.loanDetails && b.loanDetails) {
      return a.loanDetails.totalRepayment - b.loanDetails.totalRepayment;
    }
    if (a.loanDetails && !b.loanDetails) return -1;
    if (!a.loanDetails && b.loanDetails) return 1;
    return 0;
  });

  // Assign recommendation labels
  eligibleLenders.forEach((lender, index) => {
    if (index === 0) {
      lender.recommendationLabel = lender.loanDetails
        ? "Lowest estimated repayment"
        : "Top eligible option";
    } else {
      lender.recommendationLabel = "Alternative option";
    }
  });

  return {
    recommendations: eligibleLenders,
    ineligibleLenders,
    affordability: {
      loanType,
      loanAmount,
      loanTenureMonths,
      availableMonthlyRepayment:
        Math.round(availableForRepayment * 100) / 100,
      basis:
        loanType === "business"
          ? "Business cash flow minus stated expenses and existing EMIs"
          : "Take-home income minus stated expenses and existing EMIs",
    },
    summary: {
      lendersChecked: candidateProducts.length,
      eligibleCount: eligibleLenders.length,
      ineligibleCount: ineligibleLenders.length,
    },
    disclaimer:
      "These results are estimates based on published or demo lender data and the financial details provided. They are not lender offers, formal eligibility decisions, or loan approvals.",
  };
}

module.exports = getRecommendations;