import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import "./App.css";

const bankLinks = {
  "SBI": "https://sbi.bank.in/web/personal-banking/loans/personal-loans",
  "HDFC Bank": "https://www.hdfc.bank.in/personal-loan",
  "ICICI Bank": "https://www.icicibank.com/personal-banking/loans/personal-loan",
  "Axis Bank": "https://www.axisbank.com/retail/loans/personal-loan",
};

function Recommendations() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const recommendations = state?.recommendations || [];
  const ineligibleLenders = state?.ineligibleLenders || [];
  const affordability = state?.affordability || {};
  const summary = state?.summary || {};
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (loanKey) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(loanKey)) {
        return prev.filter((id) => id !== loanKey);
      }
      if (prev.length >= 3) {
        window.alert("You can compare up to 3 loans at a time.");
        return prev;
      }
      return [...prev, loanKey];
    });
  };

  const loansToCompare = recommendations.filter((loan) =>
    selectedForCompare.includes(loan.id || loan.name)
  );
  const filteredRecommendations = useMemo(() => {
    const filtered = recommendations.filter((loan) =>
      (loan.lenderName || loan.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );


    const getComparableRate = (loan) => {
      if (typeof loan.interestRate === "number") {
        return loan.interestRate;
      }

      if (typeof loan.minInterestRate === "number") {
        return loan.minInterestRate;
      }

      return null;
    };

    if (sortOrder === "low-to-high") {
      filtered.sort((a, b) => {
        const rateA = getComparableRate(a);
        const rateB = getComparableRate(b);

        if (rateA === null) return 1;
        if (rateB === null) return -1;
        return rateA - rateB;
      });
    } else if (sortOrder === "high-to-low") {
      filtered.sort((a, b) => {
        const rateA = getComparableRate(a);
        const rateB = getComparableRate(b);

        if (rateA === null) return 1;
        if (rateB === null) return -1;
        return rateB - rateA;
      });
    }


    return filtered;
  }, [recommendations, searchTerm, sortOrder]);

  return (
    <main className="recommendations-page">
      <header className="recommendations-header">
        <span className="eyebrow">LENDWISE • LOAN COMPARISON</span>
        <h1>Find a loan that fits your needs.</h1>
        <p>Compare lender criteria and explore official bank websites.</p>
        <button onClick={() => navigate("/")}>← Back to calculator</button>
      </header>
      <div className="recommendation-controls">
        <input
          type="text"
          placeholder="Search banks..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          aria-label="Search lenders"
        />

        <select
          value={sortOrder}
          onChange={(event) => setSortOrder(event.target.value)}
          aria-label="Sort by interest rate"
        >
          <option value="default">Default order</option>
          <option value="low-to-high">Interest: Low to High</option>
          <option value="high-to-low">Interest: High to Low</option>
        </select>
      </div>

      {affordability.availableMonthlyRepayment !== undefined && (
        <section className="profile-summary-strip">
          <div className="summary-card">
            <span className="summary-title">Monthly Repayment Capacity</span>
            <strong className="summary-value">
              ₹{Number(affordability.availableMonthlyRepayment).toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </strong>
            <span className="summary-subtext">Estimated safe budget for loan payment</span>
          </div>

          <div className="summary-card">
            <span className="summary-title">Underwriting Evaluation</span>
            <strong className="summary-value">
              {summary.eligibleCount || recommendations.length} of {summary.lendersChecked || recommendations.length} Eligible
            </strong>
            <span className="summary-subtext">Based on published credit & income criteria</span>
          </div>

          <div className="summary-card">
            <span className="summary-title">Application Type</span>
            <strong className="summary-value" style={{ textTransform: "capitalize" }}>
              {affordability.loanType === "business" ? "MSME / Business Loan" : "Personal Loan"}
            </strong>
            <span className="summary-subtext">Assessed against {affordability.loanType} lender guidelines</span>
          </div>
        </section>
      )}

      <div className="lender-grid"></div>







      <div className="lender-grid">
        {filteredRecommendations.map((loan, index) => (
          <article
            className="lender-card"
            key={loan.id || loan.name || loan.lenderName || index}
          >
            <div className="lender-card-top">
              <div className="bank-monogram">
                {(loan.lenderName || loan.name || "B").slice(0, 1)}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <button
                  type="button"
                  className={`compare-pill ${selectedForCompare.includes(loan.id || loan.name) ? "selected" : ""}`}
                  onClick={() => toggleCompare(loan.id || loan.name)}
                >
                  {selectedForCompare.includes(loan.id || loan.name) ? "✓ Comparing" : "+ Compare"}
                </button>
                <span className="rate-label">Indicative rate</span>
              </div>
            </div>

            <h2>{loan.lenderName || loan.name}</h2>
            {loan.productName && <p>{loan.productName}</p>}
            {loan.recommendationLabel && (
              <div
                className={
                  loan.recommendationLabel === "Lowest estimated repayment"
                    ? "recommendation-badge best-match"
                    : "recommendation-badge"
                }
              >
                {loan.recommendationLabel}
              </div>
            )}
            <div className="interest-rate">
              {typeof loan.interestRate === "number"
                ? `${loan.interestRate}%`
                : typeof loan.minInterestRate === "number" &&
                  typeof loan.maxInterestRate === "number"
                  ? `${loan.minInterestRate}%–${loan.maxInterestRate}%`
                  : typeof loan.minInterestRate === "number"
                    ? `From ${loan.minInterestRate}%`
                    : "Rate not published"}
              <small> p.a.</small>
            </div>
            {/* Repayment estimate */}
            {/* Repayment estimate */}
            {loan.loanDetails ? (
              <div className="repayment-panel">
                <div className="repayment-heading">
                  {loan.loanDetails.isRange
                    ? "Estimated repayment range"
                    : "Estimated repayment"}
                </div>

                <div className="repayment-metric">
                  <span>Monthly EMI</span>
                  <strong>
                    {loan.loanDetails.isRange
                      ? `₹${Number(loan.loanDetails.monthlyEMI).toLocaleString("en-IN", { maximumFractionDigits: 0 })} – ₹${Number(loan.loanDetails.maxMonthlyEMI).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                      : `₹${Number(loan.loanDetails.monthlyEMI).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                  </strong>
                </div>

                <div className="repayment-metric">
                  <span>Total interest</span>
                  <strong>
                    {loan.loanDetails.isRange
                      ? `₹${Number(loan.loanDetails.totalInterest).toLocaleString("en-IN", { maximumFractionDigits: 0 })} – ₹${Number(loan.loanDetails.maxTotalInterest).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                      : `₹${Number(loan.loanDetails.totalInterest).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                  </strong>
                </div>

                <div className="repayment-metric">
                  <span>Total repayment</span>
                  <strong>
                    {loan.loanDetails.isRange
                      ? `₹${Number(loan.loanDetails.totalRepayment).toLocaleString("en-IN", { maximumFractionDigits: 0 })} – ₹${Number(loan.loanDetails.maxTotalRepayment).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
                      : `₹${Number(loan.loanDetails.totalRepayment).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                  </strong>
                </div>

                {/* Net Disbursal & Processing Fee Insights */}
                {typeof loan.processingFeeMaxPercent === "number" && affordability.loanAmount && (
                  <>
                    <div className="repayment-metric">
                      <span>Est. Upfront Fee</span>
                      <strong style={{ color: "#d97706" }}>
                        ₹{Math.round((affordability.loanAmount * loan.processingFeeMaxPercent) / 100).toLocaleString("en-IN")}
                      </strong>
                    </div>

                    <div className="repayment-metric">
                      <span>Est. Net In-Hand Disbursal</span>
                      <strong style={{ color: "#059669" }}>
                        ₹{Math.round(affordability.loanAmount - (affordability.loanAmount * loan.processingFeeMaxPercent) / 100).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  </>
                )}
              </div>
            ) : loan.repaymentModel === "revolving_credit" ? (
              <div className="repayment-panel">
                <div className="repayment-heading">Revolving credit facility</div>
                <p style={{ margin: "8px 0 0", fontSize: "0.88rem", color: "#64748b", lineHeight: "1.4" }}>
                  Overdraft / Cash Credit line. Interest applies only to the utilized amount with no fixed monthly EMI.
                </p>
              </div>
            ) : null}

            <div className="lender-detail">
              <span>Minimum credit score</span>
              <strong>
                {typeof loan.minCreditScore === "number"
                  ? loan.minCreditScore
                  : "Not published"}
              </strong>
            </div>

            <div className="lender-detail">
              <span>Minimum annual income</span>
              <strong>
                {typeof loan.minAnnualIncome === "number"
                  ? `₹${loan.minAnnualIncome.toLocaleString("en-IN")}`
                  : "Not published"}
              </strong>
            </div>

            <div className="lender-detail">
              <span>Loan amount range</span>
              <strong>
                {typeof loan.minLoanAmount === "number" &&
                  typeof loan.maxLoanAmount === "number"
                  ? `₹${loan.minLoanAmount.toLocaleString("en-IN")} – ₹${loan.maxLoanAmount.toLocaleString("en-IN")}`
                  : typeof loan.maxLoanAmount === "number"
                    ? `Up to ₹${loan.maxLoanAmount.toLocaleString("en-IN")}`
                    : "Not published"}
              </strong>
            </div>

            {typeof loan.minTenureMonths === "number" &&
              typeof loan.maxTenureMonths === "number" && (
                <div className="lender-detail">
                  <span>Loan tenure</span>
                  <strong>
                    {loan.minTenureMonths}–{loan.maxTenureMonths} months
                  </strong>
                </div>
              )}

            {typeof loan.processingFeeMaxPercent === "number" && (
              <div className="lender-detail">
                <span>Maximum processing fee</span>
                <strong>
                  {loan.processingFeeMaxPercent}%
                  {loan.processingFeeIncludesTax
                    ? " (including applicable taxes)"
                    : ""}
                </strong>
              </div>
            )}
            {loan.reasons?.length > 0 && (
              <div className="eligibility-reasons">
                <h3>Why this lender matches</h3>
                <ul>
                  {loan.reasons.map((reason, index) => (
                    <li key={index}>{reason}</li>
                  ))}
                </ul>
              </div>
            )}

            <a
              className="bank-link-button"
              href={loan.officialProductUrl || bankLinks[loan.name] || "https://www.rbi.org.in/"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit Official Product Page ↗
            </a>
          </article>
        ))}
      </div>
      {/* Ineligible Lenders / Pre-qualification Explainability */}
      {ineligibleLenders.length > 0 && (
        <section className="ineligible-section">
          <div className="section-divider">
            <span>Reviewed Lenders With Unmet Criteria ({ineligibleLenders.length})</span>
          </div>
          <p className="ineligible-intro">
            These products were evaluated against your inputs but did not pass one or more eligibility checks:
          </p>

          <div className="ineligible-grid">
            {ineligibleLenders.map((loan, index) => (
              <article className="ineligible-card" key={loan.id || index}>
                <div className="ineligible-card-header">
                  <div>
                    <h3>{loan.lenderName || loan.name}</h3>
                    <p>{loan.productName || "Standard Loan Product"}</p>
                  </div>
                  <span className="unmet-badge">Criteria Gap</span>
                </div>

                <div className="rejection-reasons-box">
                  <span className="rejection-title">Specific reason(s) for non-match:</span>
                  <ul>
                    {loan.reasons.map((reason, rIdx) => (
                      <li key={rIdx}>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="ineligible-actions">
                  <a
                    className="secondary-bank-link"
                    href={loan.officialProductUrl || bankLinks[loan.name] || "https://www.rbi.org.in/"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Review Lender Policy ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {recommendations.length === 0 && (
        <p>No recommendations found. Return to the calculator and try again.</p>
      )}

      <p className="recommendation-disclaimer">
        Rates and eligibility details shown here are illustrative estimates,
        not confirmed bank offers or loan approvals. Check current terms with
        the bank before applying.
      </p>
      {/* Floating Bottom Comparison Dock */}
      {selectedForCompare.length > 0 && (
        <aside className="floating-compare-dock">
          <div className="dock-content">
            <span className="dock-label">
              <strong>{selectedForCompare.length}</strong> loan{selectedForCompare.length > 1 ? "s" : ""} selected for side-by-side comparison
            </span>
            <div className="dock-buttons">
              <button
                type="button"
                className="btn-dock-clear"
                onClick={() => setSelectedForCompare([])}
              >
                Clear
              </button>
              <button
                type="button"
                className="btn-dock-launch"
                disabled={selectedForCompare.length < 2}
                onClick={() => setIsCompareModalOpen(true)}
              >
                {selectedForCompare.length < 2
                  ? "Select 1 more to compare"
                  : `Compare ${selectedForCompare.length} Loans ↗`}
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <div
          className="compare-modal-backdrop"
          onClick={() => setIsCompareModalOpen(false)}
        >
          <div
            className="compare-modal-window"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="compare-modal-header">
              <div>
                <h2>Loan Comparison Spec Sheet</h2>
                <p>Direct side-by-side financial metric comparison</p>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsCompareModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="compare-table-container">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    {loansToCompare.map((loan) => (
                      <th key={loan.id || loan.name}>
                        <div className="th-bank-name">{loan.lenderName || loan.name}</div>
                        <div className="th-product-name">{loan.productName || "Standard Loan"}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Indicative Rate</strong></td>
                    {loansToCompare.map((loan) => (
                      <td key={loan.id || loan.name}>
                        <span className="spec-rate">
                          {typeof loan.interestRate === "number"
                            ? `${loan.interestRate}% p.a.`
                            : typeof loan.minInterestRate === "number" && typeof loan.maxInterestRate === "number"
                              ? `${loan.minInterestRate}%–${loan.maxInterestRate}% p.a.`
                              : typeof loan.minInterestRate === "number"
                                ? `From ${loan.minInterestRate}% p.a.`
                                : "Rate not published"}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Monthly EMI Range</strong></td>
                    {loansToCompare.map((loan) => (
                      <td key={loan.id || loan.name}>
                        {loan.loanDetails ? (
                          loan.loanDetails.isRange
                            ? `₹${Number(loan.loanDetails.monthlyEMI).toLocaleString("en-IN")} – ₹${Number(loan.loanDetails.maxMonthlyEMI).toLocaleString("en-IN")}`
                            : `₹${Number(loan.loanDetails.monthlyEMI).toLocaleString("en-IN")}`
                        ) : loan.repaymentModel === "revolving_credit" ? (
                          <span style={{ color: "#059669" }}>Revolving Credit (No Fixed EMI)</span>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Est. Upfront Fee</strong></td>
                    {loansToCompare.map((loan) => (
                      <td key={loan.id || loan.name}>
                        {typeof loan.processingFeeMaxPercent === "number" && affordability.loanAmount
                          ? `₹${Math.round((affordability.loanAmount * loan.processingFeeMaxPercent) / 100).toLocaleString("en-IN")} (${loan.processingFeeMaxPercent}%)`
                          : "Custom / Bank Discretion"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Est. Net In-Hand Disbursal</strong></td>
                    {loansToCompare.map((loan) => (
                      <td key={loan.id || loan.name}>
                        {typeof loan.processingFeeMaxPercent === "number" && affordability.loanAmount
                          ? `₹${Math.round(affordability.loanAmount - (affordability.loanAmount * loan.processingFeeMaxPercent) / 100).toLocaleString("en-IN")}`
                          : `₹${Number(affordability.loanAmount || 0).toLocaleString("en-IN")}`}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Min Credit Score</strong></td>
                    {loansToCompare.map((loan) => (
                      <td key={loan.id || loan.name}>
                        {typeof loan.minCreditScore === "number" ? loan.minCreditScore : "Not Published"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Tenure Flexibility</strong></td>
                    {loansToCompare.map((loan) => (
                      <td key={loan.id || loan.name}>
                        {typeof loan.minTenureMonths === "number" && typeof loan.maxTenureMonths === "number"
                          ? `${loan.minTenureMonths}–${loan.maxTenureMonths} months`
                          : "Flexible / Case by case"}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td><strong>Official Verification</strong></td>
                    {loansToCompare.map((loan) => (
                      <td key={loan.id || loan.name}>
                        <a
                          className="table-apply-btn"
                          href={loan.officialProductUrl || bankLinks[loan.name] || "https://www.rbi.org.in/"}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Bank ↗
                        </a>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Recommendations;