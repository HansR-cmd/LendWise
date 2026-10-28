
const calculateEMI = (principal, annualRate, tenureMonths) => {
  if (principal <= 0 || tenureMonths <= 0 || annualRate < 0) {
    throw new Error("Invalid loan calculation inputs");
  }

  const monthlyRate = annualRate / 12 / 100;

  // Handle a zero-interest loan
  if (monthlyRate === 0) {
    return Number((principal / tenureMonths).toFixed(2));
  }

  const factor = Math.pow(1 + monthlyRate, tenureMonths);

  const emi =
    (principal * monthlyRate * factor) / (factor - 1);
  console.log({ principal, annualRate, tenureMonths, emi });
  return Number(emi.toFixed(2));
};

module.exports = calculateEMI;
