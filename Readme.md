 LendWise — Smart Loan Recommendation System

LendWise is a smart loan recommendation and comparison system designed to help individuals and small businesses explore loan products that better fit their financial situation. The system considers loan requirements, repayment capacity, published product criteria, interest rates, fees, and lender information to support more informed borrowing decisions.

The project focuses on personal loans and Micro, Small and Medium Enterprise (MSME) financing in India, with product records covering banks, Non-Banking Financial Companies (NBFCs), Small Finance Banks, and fintech-associated lending products.

 Project Objectives

- Recommend loan products based on the user's selected loan category and financial information.
- Evaluate estimated monthly repayment capacity using income or business cash flow, expenses, and existing EMIs.
- Compare available interest rates, loan limits, repayment tenures, and processing fees.
- Display product eligibility criteria and explain why a product may or may not match the user's inputs.
- Maintain structured loan-product data with official source links and verification-status fields.
- Help users explore suitable financial products without treating recommendations as guaranteed loan approvals.

 Key Features

 1. Personal and Business Loan Categories

Users can select between personal loans and business/MSME loans. The recommendation workflow uses the selected category to filter relevant products.

 2. Financial Profile Assessment

The application collects financial inputs such as loan amount, tenure, income, expenses, existing EMIs, and credit score. Business-loan assessments also consider monthly business cash flow.

The initial repayment-capacity calculations are:

**Personal loans**

Available monthly repayment = Monthly income − Monthly expenses − Existing EMIs

**Business loans**

Available monthly repayment = Monthly business cash flow − Monthly expenses − Existing EMIs

These calculations provide an initial affordability estimate. They do not replace a lender's own underwriting or eligibility assessment.

 3. Loan Product Comparison

The structured product dataset supports fields such as:

- Lender and product name
- Lender category and loan type
- Minimum and maximum published interest rates
- Loan amount limits
- Repayment tenure
- Minimum credit score, where available
- Minimum business vintage, where available
- Processing fee information
- Official product URLs
- Source verification date and data status

Unavailable information is represented using `null` where appropriate, rather than being treated as a confirmed value.

 4. Recommendation Engine

The backend evaluates products against available criteria, including loan amount, tenure, credit score, income requirements, and estimated repayment capacity. It separates products that pass the implemented checks from those that fail one or more checks and provides explanatory reasons.

For fixed-EMI loans, the system can calculate estimated monthly instalments, total interest, and total repayment. Products with revolving-credit repayment models, such as cash credit and overdraft facilities, require different assessment logic and should not be treated as conventional fixed-EMI loans.

 5. Search and Sorting

The recommendations interface supports searching lender names and sorting products by available interest-rate information.

 6. Official Product References

Loan cards link to official lender or product pages when a URL is available, allowing users to review current terms directly with the provider.

 Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Frontend tooling | Vite |
| Routing | React Router |
| Styling | CSS |
| Backend | Node.js |
| API framework | Express.js |
| Database | MongoDB |
| Product data | Structured JavaScript dataset |
| API testing | Postman |

 Project Structure

```text
Lendwise_main/
├── apps/
│   └── web/
│       └── src/
│           ├── App.jsx
│           ├── Recommendations.jsx
│           └── App.css
├── services/
│   └── api-gateway/
│       ├── routes/
│       │   └── recommendationRoutes.js
│       └── utils/
│           └── recommendationEngine.js
├── data/
│   ├── lenders.js
│   └── loanProducts.js
└── README.md
```

The structure above shows the main files used by the application. Additional configuration files, package manifests, and supporting modules may also be present in the repository.

 Loan Product Dataset

The `data/loanProducts.js` file stores product information in a structured JavaScript array.

The dataset includes examples from the following categories:

- **NBFCs:** Bajaj Finance, Tata Capital, and Lendingkart Finance
- **Small Finance Banks:** AU Small Finance Bank and Ujjivan Small Finance Bank
- **Banks:** HDFC Bank, SBI, ICICI Bank, Bank of Baroda, Axis Bank, and Kotak Mahindra Bank
- **Fintech-associated lending:** A BharatPe-linked merchant-loan record identifying the associated lending entity

The dataset distinguishes between the actual lender and a platform partner where applicable. Product details, rates, fees, and eligibility conditions may vary by applicant and can change over time.

**Data quality note:** Product records are reference data, not live lender quotations. A populated field should not automatically be interpreted as independently verified or currently applicable. Users should check the official product page and confirm terms with the lender before applying.

 Application Workflow

1. The user selects a personal or business loan.
2. The user enters the requested loan amount, tenure, and financial information.
3. The frontend sends the inputs to the backend recommendation API.
4. The backend validates the request.
5. The recommendation engine filters and evaluates available product records.
6. The engine calculates repayment estimates where the product's repayment model and rate information support them.
7. The frontend displays matching products, relevant criteria, available estimates, and official product links.

 API Endpoint

**Method:** `POST`

**Endpoint:** `/recommendations`

The endpoint accepts a JSON request containing the loan category, requested amount, annual and monthly income, expenses, existing EMIs, credit score, requested tenure, and business cash flow for business-loan requests.

Example request:

```json
{
  "loanType": "business",
  "loanAmount": 500000,
  "annualIncome": 1200000,
  "monthlyIncome": 80000,
  "monthlyExpenses": 25000,
  "existingEMIs": 5000,
  "monthlyBusinessCashFlow": 100000,
  "creditScore": 750,
  "loanTenureMonths": 36
}
```

For a personal-loan request, use `"loanType": "personal"`. Business requests should supply a valid numeric `monthlyBusinessCashFlow`.

The API returns recommendation results, products that fail the implemented checks, affordability information, summary counts, and a disclaimer.

 Installation and Setup

 Prerequisites

- Node.js and npm
- MongoDB
- Git
- A code editor such as Visual Studio Code

 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Lendwise_main
```

Replace the placeholder with the URL of your GitHub repository.

 2. Install backend dependencies

From the project root, install dependencies using the root `package.json` if it exists:

```bash
npm install
```

 3. Install frontend dependencies

```bash
cd apps/web
npm install
```

 4. Configure MongoDB

Ensure MongoDB is running. The development environment has used the following local connection string:

```text
mongodb://127.0.0.1:27017/lendwise
```

If the backend uses environment variables, configure them in a local `.env` file according to the application's configuration. Do not commit credentials, passwords, or API keys to GitHub.

 5. Start the backend

Open a terminal at the project root:

```bash
npm start
```

The backend has been configured to use port `5000` in the development environment.

 6. Start the frontend

Open another terminal:

```bash
cd apps/web
npm run dev
```

Open the local URL printed by Vite, which has been `http://localhost:5173/` in development.

**Note:** These commands assume the corresponding npm scripts are present in your package files. If a command fails, check the relevant `package.json` and the backend's environment configuration.

 Testing

The backend recommendation endpoint has been tested using Postman, including validation of personal and business loan requests. The frontend and backend have also been run in the development environment.

Before a production release, test the complete user journey and verify:

- Personal and business product filtering
- Input validation and invalid requests
- Repayment capacity and EMI calculations
- Products with missing interest rates or eligibility criteria
- Rate-range calculations and fee handling
- Revolving-credit products
- Official links and product-data accuracy
- Error handling and database connectivity

 Limitations

- Recommendations depend on the completeness and accuracy of the available product dataset.
- Interest rates, eligibility requirements, fees, and loan limits can change.
- Published minimum rates do not guarantee that an applicant will receive that rate.
- A product passing the application's checks does not imply formal lender eligibility or loan approval.
- The initial affordability formula is simplified and does not represent a complete credit-underwriting model.
- Revolving-credit facilities need repayment and cost calculations specific to their terms.
- Product records should be periodically reviewed against official sources.

 Future Enhancements

- Expand the dataset with additional verified NBFC and Small Finance Bank products.
- Add product-level source tracking and automated data-quality checks.
- Improve cost comparisons by including processing fees and other applicable charges.
- Improve rate-range and revolving-credit calculations.
- Incorporate business vintage and additional eligibility inputs.
- Add stronger automated testing, logging, and error handling.
- Improve recommendation explanations and user-facing affordability insights.

 Disclaimer

LendWise is an informational loan-comparison and recommendation project. It does not issue loans, guarantee eligibility, or provide formal loan approval. All estimates depend on user inputs and available product information. Applicants should verify current interest rates, fees, eligibility criteria, and repayment terms with the actual lender before making a borrowing decision.

 Author

Developed as a Smart Loan Recommendation System project using React, Node.js, Express, and MongoDB.
