const getRecommendations = require("../services/api-gateway/utils/recommendationEngine");
const loanProducts = require("../data/loanProducts");

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log("✓ PASS:", name);
    passed++;
  } else {
    console.error("✗ FAIL:", name);
    failed++;
  }
}

console.log("\n==========================================");
console.log("   LENDWISE TEST SUITE - AUTOMATED CHECKS");
console.log("==========================================\n");

// ----------------------------------------------------
// TEST 1: Dataset Integrity & Schema Checks
// ----------------------------------------------------
console.log("--- TEST SUITE 1: Dataset Integrity ---");
assert(loanProducts.length === 13, "Dataset has exactly 13 verified products (7 Personal + 6 Business)");
assert(
  loanProducts.every(
    (p) => p.officialProductUrl && p.officialProductUrl.startsWith("http")
  ),
  "All products have valid official URLs"
);
assert(
  loanProducts.every((p) => p.id && p.lenderName && p.productName),
  "All products have non-empty id, lenderName, and productName"
);

// ----------------------------------------------------
// TEST 2: Personal Loan Recommendation Engine
// ----------------------------------------------------
console.log("\n--- TEST SUITE 2: Personal Loan Recommendation Engine ---");
const personalRes = getRecommendations({
  loanType: "personal",
  loanAmount: 500000,
  annualIncome: 1200000,
  monthlyIncome: 80000,
  monthlyExpenses: 25000,
  existingEMIs: 0,
  monthlyBusinessCashFlow: 0,
  creditScore: 750,
  loanTenureMonths: 36,
});

assert(
  personalRes.recommendations.length === 7,
  "All 7 verified personal loans qualify for strong credit profile (750 score, ₹5L, 36m)"
);
assert(
  !personalRes.recommendations.some((p) => p.isDemoRecord),
  "No legacy demo records in verified personal recommendations"
);
assert(
  personalRes.affordability.loanAmount === 500000,
  "Loan amount correctly passed in affordability payload"
);
assert(
  personalRes.recommendations.every(
    (p) => p.loanDetails && p.loanDetails.monthlyEMI > 0
  ),
  "All personal loans calculate valid positive monthly EMI"
);

// ----------------------------------------------------
// TEST 3: Business Loan & Revolving Credit Flow
// ----------------------------------------------------
console.log("\n--- TEST SUITE 3: Business Loan & Revolving Credit Flow ---");
const businessRes = getRecommendations({
  loanType: "business",
  loanAmount: 1000000,
  annualIncome: 2000000,
  monthlyIncome: 100000,
  monthlyExpenses: 30000,
  existingEMIs: 0,
  monthlyBusinessCashFlow: 150000,
  creditScore: 720,
  loanTenureMonths: 24, // 24m fits term loans and Lendingkart (max 36m)
});

assert(
  businessRes.recommendations.length >= 4,
  "Multiple verified business products qualify for ₹10L at 24 months"
);
const auSfb = businessRes.recommendations.find(
  (p) => p.id === "au-sfb-working-capital"
);
assert(
  auSfb && auSfb.repaymentModel === "revolving_credit" && auSfb.loanDetails === null,
  "AU SFB revolving credit has null loanDetails (no misleading fixed EMI)"
);
const bajaj = businessRes.recommendations.find(
  (p) => p.id === "bajaj-finance-business-loan"
);
assert(
  bajaj && bajaj.loanDetails.isRange === true,
  "Bajaj Finance has isRange = true for published interest rate range"
);
assert(
  bajaj.loanDetails.maxMonthlyEMI > bajaj.loanDetails.monthlyEMI,
  "Bajaj max estimated EMI is strictly higher than min estimated EMI"
);

// ----------------------------------------------------
// TEST 4: Adverse Action & Rejection Checks
// ----------------------------------------------------
console.log("\n--- TEST SUITE 4: Adverse Action & Rejection Checks ---");
const rejectedRes = getRecommendations({
  loanType: "business",
  loanAmount: 9000000, // exceeds all max limits
  annualIncome: 1200000,
  monthlyIncome: 80000,
  monthlyExpenses: 25000,
  existingEMIs: 0,
  monthlyBusinessCashFlow: 100000,
  creditScore: 600, // below most cutoffs
  loanTenureMonths: 84, // exceeds most tenure limits
});

assert(
  rejectedRes.ineligibleLenders.length >= 4,
  "Multiple ineligible lenders correctly tracked in ineligibleLenders array"
);
const rejectedBajaj = rejectedRes.ineligibleLenders.find(
  (p) => p.id === "bajaj-finance-business-loan"
);
assert(
  rejectedBajaj && rejectedBajaj.reasons.some((r) => r.includes("Credit score")),
  "Bajaj rejection explicitly specifies credit score gap"
);
assert(
  rejectedBajaj && rejectedBajaj.reasons.some((r) => r.includes("maximum limit")),
  "Bajaj rejection explicitly specifies loan amount maximum limit"
);
const rejectedTata = rejectedRes.ineligibleLenders.find(
  (p) => p.id === "tata-capital-business-loan"
);
assert(
  rejectedTata && rejectedTata.reasons.some((r) => r.includes("tenure")),
  "Tata rejection explicitly specifies tenure limit"
);

// ----------------------------------------------------
// TEST 5: Repayment Capacity & Zero Cash Flow Protection
// ----------------------------------------------------
console.log("\n--- TEST SUITE 5: Zero Cash Flow & Burden Protection ---");
const zeroCapacityRes = getRecommendations({
  loanType: "personal",
  loanAmount: 500000,
  annualIncome: 500000,
  monthlyIncome: 40000,
  monthlyExpenses: 30000,
  existingEMIs: 15000, // 30k + 15k = 45k > 40k income!
  monthlyBusinessCashFlow: 0,
  creditScore: 750,
  loanTenureMonths: 36,
});

assert(
  zeroCapacityRes.recommendations.length === 0,
  "Zero eligible loans when applicant has negative repayment capacity"
);
assert(
  zeroCapacityRes.ineligibleLenders.length === 7,
  "All 7 candidate personal loans marked ineligible due to cash capacity deficit"
);

// ----------------------------------------------------
// Summary
// ----------------------------------------------------
console.log("\n==========================================");
console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log("==========================================\n");

if (failed > 0) {
  process.exit(1);
} else {
  console.log("🎉 ALL TESTS PASSED SUCCESSFULLY!\n");
}
