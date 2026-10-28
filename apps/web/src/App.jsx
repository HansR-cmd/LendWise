import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Recommendations from './Recommendations.jsx'

import './App.css'

function App() {
  const [loanType, setLoanType] = useState("personal");
  const [loanAmount, setLoanAmount] = useState(500000)
  const [annualIncome, setAnnualIncome] = useState(1200000)
  const [creditScore, setCreditScore] = useState(750)
  const [tenure, setTenure] = useState(5)
  const [monthlyIncome, setMonthlyIncome] = useState(80000)
  const [monthlyExpenses, setMonthlyExpenses] = useState(25000)
  const [existingEMIs, setExistingEMIs] = useState(0)
  const [monthlyBusinessCashFlow, setMonthlyBusinessCashFlow] = useState(100000)
  const navigate = useNavigate()
  const availableMonthlyRepayment =
    loanType === "business"
      ? monthlyBusinessCashFlow - monthlyExpenses - existingEMIs
      : monthlyIncome - monthlyExpenses - existingEMIs;

  // Real-time Underwriting Metrics: FOIR (Fixed Obligation to Income Ratio)
  const totalInflow = loanType === "business" ? monthlyBusinessCashFlow : monthlyIncome;
  const benchmarkRate = 0.11 / 12;
  const benchmarkMonths = tenure * 12;
  const estimatedEMI =
    (loanAmount * benchmarkRate * Math.pow(1 + benchmarkRate, benchmarkMonths)) /
    (Math.pow(1 + benchmarkRate, benchmarkMonths) - 1);
  const totalDebtObligations = existingEMIs + estimatedEMI;
  const foirRatio = totalInflow > 0 ? Math.round((totalDebtObligations / totalInflow) * 100) : 0;

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <Routes>
      <Route path="/" element={
        <div className="app">
          <header className="navbar">
            <a className="brand" href="#">
              <span className="brand-icon">L</span>
              LendWise
            </a>

            <nav>
              <a href="#features">Features</a>
              <a href="#calculator">EMI Calculator</a>
              <a href="#about">About</a>
            </nav>

            <a className="nav-button" href="#calculator">
              Get Started
            </a>
          </header>

          <main>
            <section className="hero-section">
              <div className="hero-content">
                <span className="eyebrow">SMARTER BORROWING STARTS HERE</span>
                <h1>
                  Find a loan that
                  <br />
                  <span>works for you.</span>
                </h1>
                <p>
                  Compare loan options, estimate your monthly payments, and make
                  more informed borrowing decisions with LendWise.
                </p>
                <a className="primary-button" href="#calculator">
                  Explore your options <span>→</span>
                </a>
                <div className="hero-note">
                  <span className="status-dot"></span>
                  Clear estimates. Smarter decisions.
                </div>
              </div>

              <div className="hero-card">
                <div className="card-top">
                  <div>
                    <span className="muted-label">YOUR LOAN SNAPSHOT</span>
                    <h2>Plan with confidence</h2>
                  </div>
                  <span className="card-symbol">↗</span>
                </div>

                <div className="amount-box">
                  <span>Loan amount</span>
                  <strong>{formatCurrency(loanAmount)}</strong>
                </div>

                <div className="snapshot-row">
                  <div>
                    <span>Annual income</span>
                    <strong>{formatCurrency(annualIncome)}</strong>
                  </div>
                  <div>
                    <span>Credit score</span>
                    <strong>{creditScore}</strong>
                  </div>
                </div>

                <div className="card-divider"></div>
                <div className="snapshot-footer">
                  <span>Personalised loan planning</span>
                  <span className="check-mark">✓</span>
                </div>
              </div>
            </section>

            <section className="features-section" id="features">
              <div className="section-heading">
                <span className="eyebrow">WHY LENDWISE</span>
                <h2>Make your next financial move count.</h2>
                <p>Understand your options before making a borrowing decision.</p>
              </div>

              <div className="feature-grid">
                <article className="feature-card">
                  <span className="feature-icon">₹</span>
                  <h3>EMI Calculator</h3>
                  <p>Estimate monthly payments and understand your repayment plan.</p>
                </article>
                <article className="feature-card">
                  <span className="feature-icon">⌕</span>
                  <h3>Loan Comparison</h3>
                  <p>Explore lender options based on your financial information.</p>
                </article>
                <article className="feature-card">
                  <span className="feature-icon">✓</span>
                  <h3>Eligibility Insights</h3>
                  <p>Review indicative eligibility using basic financial criteria.</p>
                </article>
              </div>
            </section>

            <section className="calculator-section" id="calculator">
              <div className="calculator-intro">
                <span className="eyebrow">START PLANNING</span>
                <h2>Your loan, your numbers.</h2>
                <p>
                  Adjust the details to explore an illustrative monthly repayment.
                  This estimate is not a lender offer or an eligibility decision.
                </p>
              </div>


              <div className="calculator-card">
                {/* Modern Segmented Tab Switcher */}
                <div className="loan-type-tabs">
                  <button
                    type="button"
                    className={`tab-btn ${loanType === "personal" ? "active" : ""}`}
                    onClick={() => setLoanType("personal")}
                  >
                    👤 Personal Loan
                  </button>
                  <button
                    type="button"
                    className={`tab-btn ${loanType === "business" ? "active" : ""}`}
                    onClick={() => setLoanType("business")}
                  >
                    🏢 MSME / Business Loan
                  </button>
                </div>

                {/* Loan Amount with Quick Presets */}
                <div className="field">
                  <div className="field-heading">
                    <label htmlFor="loanAmount">Required loan amount</label>
                    <strong>{formatCurrency(loanAmount)}</strong>
                  </div>

                  <div className="quick-presets">
                    {[100000, 300000, 500000, 1000000, 2500000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className={`preset-btn ${loanAmount === amt ? "active" : ""}`}
                        onClick={() => setLoanAmount(amt)}
                      >
                        ₹{amt >= 100000 ? `${amt / 100000} Lakh` : `${amt / 1000}k`}
                      </button>
                    ))}
                  </div>

                  <input
                    id="loanAmount"
                    type="range"
                    min="50000"
                    max="5000000"
                    step="25000"
                    value={loanAmount}
                    onChange={(event) => setLoanAmount(Number(event.target.value))}
                  />
                  <div className="range-labels">
                    <span>₹50,000</span>
                    <span>₹50,00,000</span>
                  </div>
                </div>

                <div className="field">
                  <div className="field-heading">
                    <label htmlFor="annualIncome">Annual income</label>
                    <strong>{formatCurrency(annualIncome)}</strong>
                  </div>
                  <input
                    id="annualIncome"
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={annualIncome}
                    onChange={(event) => {
                      const newAnnual = Number(event.target.value);
                      setAnnualIncome(newAnnual);
                      // Auto-sync monthly take-home income (Annual ÷ 12)
                      const calculatedMonthly = Math.round(newAnnual / 12);
                      setMonthlyIncome(calculatedMonthly);
                      if (loanType === "business") {
                        setMonthlyBusinessCashFlow(calculatedMonthly);
                      }
                    }}
                  />
                  <div className="range-labels">
                    <span>₹1,00,000</span>
                    <span>₹50,00,000</span>
                  </div>
                </div>
                <div className="field">
                  <div className="field-heading">
                    <label htmlFor="monthlyIncome">Monthly take-home income</label>
                    <strong>{formatCurrency(monthlyIncome)}</strong>
                  </div>
                  <input
                    id="monthlyIncome"
                    type="number"
                    min="0"
                    value={monthlyIncome}
                    onChange={(event) => setMonthlyIncome(Number(event.target.value))}
                  />
                </div>

                <div className="field">
                  <div className="field-heading">
                    <label htmlFor="monthlyExpenses">Essential monthly expenses</label>
                    <strong>{formatCurrency(monthlyExpenses)}</strong>
                  </div>
                  <input
                    id="monthlyExpenses"
                    type="number"
                    min="0"
                    value={monthlyExpenses}
                    onChange={(event) => setMonthlyExpenses(Number(event.target.value))}
                  />
                </div>

                <div className="field">
                  <div className="field-heading">
                    <label htmlFor="existingEMIs">Existing monthly loan EMIs</label>
                    <strong>{formatCurrency(existingEMIs)}</strong>
                  </div>
                  <input
                    id="existingEMIs"
                    type="number"
                    min="0"
                    value={existingEMIs}
                    onChange={(event) => setExistingEMIs(Number(event.target.value))}
                  />
                </div>

                {loanType === "business" && (
                  <div className="field">
                    <div className="field-heading">
                      <label htmlFor="monthlyBusinessCashFlow">
                        Monthly business cash flow available for loan repayment
                      </label>
                      <strong>{formatCurrency(monthlyBusinessCashFlow)}</strong>
                    </div>
                    <input
                      id="monthlyBusinessCashFlow"
                      type="number"
                      min="0"
                      value={monthlyBusinessCashFlow}
                      onChange={(event) =>
                        setMonthlyBusinessCashFlow(Number(event.target.value))
                      }
                    />
                  </div>
                )}
                <div className="field">
                  <div className="field-heading">
                    <label htmlFor="creditScore">Credit score</label>
                    <strong>{creditScore}</strong>
                  </div>
                  <input
                    id="creditScore"
                    type="range"
                    min="300"
                    max="900"
                    step="10"
                    value={creditScore}
                    onChange={(event) => setCreditScore(Number(event.target.value))}
                  />
                  <div className="range-labels">
                    <span>300</span>
                    <span>900</span>
                  </div>
                </div>

                <div className="field">
                  <div className="field-heading">
                    <label htmlFor="tenure">Loan tenure</label>
                    <strong>{tenure} years</strong>
                  </div>
                  <input
                    id="tenure"
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={tenure}
                    onChange={(event) => setTenure(Number(event.target.value))}
                  />
                  <div className="range-labels">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>

                <div className="estimate-box">
                  <span>Estimated monthly EMI</span>
                  <strong>
                    {formatCurrency(
                      (() => {
                        const principal = loanAmount
                        const monthlyRate = 0.1 / 12
                        const months = tenure * 12
                        return (
                          (principal *
                            monthlyRate *
                            Math.pow(1 + monthlyRate, months)) /
                          (Math.pow(1 + monthlyRate, months) - 1)
                        )
                      })()
                    )}
                  </strong>
                  <p>Illustration based on a fixed 10% annual interest rate.</p>
                </div>
                <p>Illustration based on a fixed 10% annual interest rate.</p>
              </div>

              <div className="estimate-box">
                <span>Available monthly repayment capacity</span>
                <strong>
                  {formatCurrency(availableMonthlyRepayment)}
                </strong>
                <p>
                  {availableMonthlyRepayment > 0
                    ? "Estimated safe surplus remaining after monthly expenses and debt obligations."
                    : "Your stated expenses and existing EMIs leave no amount available for a new loan payment."}
                </p>
              </div>

              {/* Live Underwriting FOIR Metric */}
              <div className="foir-metric-card">              {/* Live Underwriting FOIR Metric */}
                <div className="foir-metric-card">
                  <div className="foir-header">
                    <span>Underwriting Risk Indicator (FOIR)</span>
                    <strong className={foirRatio <= 40 ? "tag-low" : foirRatio <= 50 ? "tag-mid" : "tag-high"}>
                      {foirRatio}% • {foirRatio <= 40 ? "Low Risk (High Approval)" : foirRatio <= 50 ? "Moderate" : "High Debt Burden"}
                    </strong>
                  </div>
                  <div className="foir-bar-bg">
                    <div
                      className="foir-bar-fill"
                      style={{
                        width: `${Math.min(foirRatio, 100)}%`,
                        backgroundColor: foirRatio <= 40 ? "#059669" : foirRatio <= 50 ? "#d97706" : "#dc2626",
                      }}
                    ></div>
                  </div>
                  <p className="foir-tip">
                    Indian lenders prefer total debt commitments below 40%–50% of your monthly cash flow.
                  </p>
                </div>
                <button
                  className="primary-button calculator-button"
                  type="button"
                  onClick={async () => {
                    try {
                      const response = await fetch("http://localhost:5000/recommendations", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          userId: "6ad2009f41dc62f072330985",
                          loanType,
                          loanAmount: Number(loanAmount),
                          annualIncome: Number(annualIncome),
                          monthlyIncome: Number(monthlyIncome),
                          monthlyExpenses: Number(monthlyExpenses),
                          existingEMIs: Number(existingEMIs),
                          monthlyBusinessCashFlow:
                            loanType === "business"
                              ? Number(monthlyBusinessCashFlow)
                              : null,
                          creditScore: Number(creditScore),
                          loanTenureMonths: Number(tenure) * 12,
                          purpose: loanType === "business" ? "Business" : "Personal loan",
                        }),
                      });

                      const data = await response.json();
                      if (!response.ok) {
                        throw new Error(data.message || "Request failed");
                      }
                      navigate("/recommendations", { state: data });
                    } catch (error) {
                      window.alert("Could not connect to the backend. Check that it is running.");
                    }
                  }}
                >
                  Explore loan recommendations <span>→</span>
                </button>
              </div>
            </section>

            <section className="about-section" id="about">
              <span className="eyebrow">BUILT FOR BETTER DECISIONS</span>
              <h2>Financial choices should feel clearer.</h2>
              <p>
                LendWise is a smart loan recommendation project designed to bring
                loan planning, repayment estimates, and lender comparisons into one
                straightforward experience.
              </p>
            </section>
          </main>

          <footer className="footer">
            <a className="brand" href="#">
              <span className="brand-icon">L</span>
              LendWise
            </a>
            <p>Plan thoughtfully. Borrow responsibly.</p>
            <span>© {new Date().getFullYear()} LendWise</span>
          </footer>
        </div>
      } />
      <Route
        path="/recommendations"
        element={<Recommendations />}
      />
    </Routes>
  )
}

export default App