const loanProducts = [
    // ==========================================
    // 1. BUSINESS / MSME LOANS
    // ==========================================
    {
        id: "bajaj-finance-business-loan",
        lenderName: "Bajaj Finance",
        lenderType: "nbfc",
        loanType: "business",
        productName: "Business Loan",

        minInterestRate: 14.0,
        maxInterestRate: 23.5,
        minCreditScore: 650,
        minBusinessVintageYears: 3,

        minLoanAmount: 200000,
        maxLoanAmount: 8000000,
        minTenureMonths: 12,
        maxTenureMonths: 96,

        processingFeeMaxPercent: 4.72,
        processingFeeIncludesTax: true,

        officialProductUrl: "https://www.bajajfinserv.in/business-loan",
        officialFeesUrl: "https://www.bajajfinserv.in/all-fees-and-charges",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "tata-capital-business-loan",
        lenderName: "Tata Capital",
        lenderType: "nbfc",
        loanType: "business",
        productName: "MSME Business Term Loan",

        minInterestRate: 12.0,
        maxInterestRate: 19.5,
        minCreditScore: 680,
        minBusinessVintageYears: 2,

        minLoanAmount: 300000,
        maxLoanAmount: 7500000,
        minTenureMonths: 12,
        maxTenureMonths: 60,

        processingFeeMaxPercent: 2.75,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.tatacapital.com/business-loan.html",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "hdfc-business-growth-loan",
        lenderName: "HDFC Bank",
        lenderType: "private_bank",
        loanType: "business",
        productName: "Business Growth Loan",

        minInterestRate: 11.9,
        maxInterestRate: 21.35,
        minCreditScore: 700,
        minBusinessVintageYears: 3,

        minLoanAmount: 500000,
        maxLoanAmount: 5000000,
        minTenureMonths: 12,
        maxTenureMonths: 48,

        processingFeeMaxPercent: 2.0,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.hdfcbank.com/sme/borrow/business-loans/business-growth-loan",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "lendingkart-msme-loan",
        lenderName: "Lendingkart Finance",
        lenderType: "fintech_nbfc",
        loanType: "business",
        productName: "Unsecured MSME Loan",

        minInterestRate: 15.0,
        maxInterestRate: 27.0,
        minCreditScore: 625,
        minBusinessVintageYears: 1,

        minLoanAmount: 50000,
        maxLoanAmount: 4000000,
        minTenureMonths: 6,
        maxTenureMonths: 36,

        processingFeeMaxPercent: 3.0,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.lendingkart.com/business-loans",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "bharatpe-liquiloans-merchant-loan",
        lenderName: "Liquiloans (NDX P2P)",
        lenderType: "fintech_nbfc_partner",
        loanType: "business",
        productName: "Merchant Easy Loan (via BharatPe)",
        platformPartner: "BharatPe",

        minInterestRate: 15.0,
        maxInterestRate: 24.0,
        minCreditScore: 620,
        minBusinessVintageYears: 0.5,

        minLoanAmount: 25000,
        maxLoanAmount: 1000000,
        minTenureMonths: 3,
        maxTenureMonths: 12,

        processingFeeMaxPercent: 2.5,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://bharatpe.com/loans",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "au-sfb-working-capital",
        lenderName: "AU Small Finance Bank",
        lenderType: "small_finance_bank",
        loanType: "business",
        productName: "Working Capital Loans",
        facilityTypes: ["cash_credit", "overdraft"],
        repaymentModel: "revolving_credit",

        minInterestRate: null,
        maxInterestRate: null,
        minCreditScore: null,
        minAnnualIncome: null,
        minLoanAmount: null,
        maxLoanAmount: null,

        collateralFreeOverdraftLimit: 20000000,
        collateralFreeLimitScheme: "CGTMSE",
        processingFeeDescription: "Published as competitive; exact applicable fee confirmed with the bank.",

        officialProductUrl: "https://www.au.bank.in/business-banking/working-capital-loans",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "official_product_rate_not_published",
    },

    // ==========================================
    // 2. PERSONAL LOANS
    // ==========================================
    {
        id: "sbi-xpress-credit",
        lenderName: "State Bank of India",
        lenderType: "public_sector_bank",
        loanType: "personal",
        productName: "SBI Xpress Credit Personal Loan",

        minInterestRate: 11.15,
        maxInterestRate: 14.3,
        minCreditScore: 700,
        minAnnualIncome: 360000,

        minLoanAmount: 100000,
        maxLoanAmount: 3000000,
        minTenureMonths: 6,
        maxTenureMonths: 72,

        processingFeeMaxPercent: 1.5,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://sbi.bank.in/web/personal-banking/loans/personal-loans/xpress-credit-personal-loan",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "hdfc-personal-loan",
        lenderName: "HDFC Bank",
        lenderType: "private_bank",
        loanType: "personal",
        productName: "HDFC Bank Personal Loan",

        minInterestRate: 10.5,
        maxInterestRate: 21.0,
        minCreditScore: 720,
        minAnnualIncome: 300000,

        minLoanAmount: 50000,
        maxLoanAmount: 4000000,
        minTenureMonths: 12,
        maxTenureMonths: 60,

        processingFeeMaxPercent: 2.5,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.hdfc.bank.in/personal-loan",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "icici-personal-loan",
        lenderName: "ICICI Bank",
        lenderType: "private_bank",
        loanType: "personal",
        productName: "ICICI Instant Personal Loan",

        minInterestRate: 10.75,
        maxInterestRate: 19.0,
        minCreditScore: 700,
        minAnnualIncome: 360000,

        minLoanAmount: 50000,
        maxLoanAmount: 5000000,
        minTenureMonths: 12,
        maxTenureMonths: 72,

        processingFeeMaxPercent: 2.25,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.icicibank.com/personal-banking/loans/personal-loan",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "bob-personal-loan",
        lenderName: "Bank of Baroda",
        lenderType: "public_sector_bank",
        loanType: "personal",
        productName: "Baroda Personal Loan",

        minInterestRate: 10.9,
        maxInterestRate: 18.25,
        minCreditScore: 680,
        minAnnualIncome: 240000,

        minLoanAmount: 50000,
        maxLoanAmount: 2000000,
        minTenureMonths: 12,
        maxTenureMonths: 60,

        processingFeeMaxPercent: 2.0,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.bankofbaroda.in/personal-banking/loans/personal-loan",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "axis-personal-loan",
        lenderName: "Axis Bank",
        lenderType: "private_bank",
        loanType: "personal",
        productName: "Axis 24x7 Personal Loan",

        minInterestRate: 10.49,
        maxInterestRate: 22.0,
        minCreditScore: 700,
        minAnnualIncome: 180000,

        minLoanAmount: 50000,
        maxLoanAmount: 4000000,
        minTenureMonths: 12,
        maxTenureMonths: 60,

        processingFeeMaxPercent: 2.0,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.axisbank.com/retail/loans/personal-loan",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "kotak-personal-loan",
        lenderName: "Kotak Mahindra Bank",
        lenderType: "private_bank",
        loanType: "personal",
        productName: "Kotak Quick Personal Loan",

        minInterestRate: 10.99,
        maxInterestRate: 24.0,
        minCreditScore: 710,
        minAnnualIncome: 300000,

        minLoanAmount: 50000,
        maxLoanAmount: 2500000,
        minTenureMonths: 12,
        maxTenureMonths: 60,

        processingFeeMaxPercent: 3.0,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.kotak.com/en/personal-banking/loans/personal-loan.html",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },

    {
        id: "tata-personal-loan",
        lenderName: "Tata Capital",
        lenderType: "nbfc",
        loanType: "personal",
        productName: "Tata Capital Personal Loan",

        minInterestRate: 10.99,
        maxInterestRate: 26.0,
        minCreditScore: 675,
        minAnnualIncome: 240000,

        minLoanAmount: 75000,
        maxLoanAmount: 3500000,
        minTenureMonths: 12,
        maxTenureMonths: 72,

        processingFeeMaxPercent: 2.75,
        processingFeeIncludesTax: false,

        officialProductUrl: "https://www.tatacapital.com/personal-loan.html",
        sourceVerifiedAt: "2026-10-25",
        dataStatus: "published_range_verified",
    },
    // Ujjivan Small Finance Bank — Fast Track Business Loan
    {
        id: "ujjivan-fast-track-business-loan",
        lenderName: "Ujjivan Small Finance Bank",
        lenderType: "small_finance_bank",
        loanType: "business",
        productName: "Fast Track Loan",

        minInterestRate: 26,
        maxInterestRate: 28,
        minCreditScore: null,
        minBusinessVintageYears: null,

        minLoanAmount: 51000,
        maxLoanAmount: 500000,
        minTenureMonths: null,
        maxTenureMonths: 36,

        processingFeeMaxPercent: 2.5,
        processingFeeIncludesTax: false,

        officialProductUrl:
            "https://www.ujjivansfb.bank.in/personal/loans/fastrack-loan",
        sourceVerifiedAt: "2026-10-28",
        dataStatus: "official_published_terms_needs_periodic_reverification",
    },

    // Lendingkart Finance — Business Loan
    {
        id: "lendingkart-business-loan",
        lenderName: "Lendingkart Finance",
        lenderType: "nbfc",
        loanType: "business",
        productName: "Business Loan",

        minInterestRate: 13.5,
        maxInterestRate: null,
        minCreditScore: null,
        minBusinessVintageYears: null,

        minLoanAmount: 100000,
        maxLoanAmount: 5000000,
        minTenureMonths: 12,
        maxTenureMonths: 36,

        processingFeeMaxPercent: null,
        processingFeeIncludesTax: false,

        officialProductUrl:
            "https://www.lendingkart.com/business-loans",
        officialFeesUrl:
            "https://www.lendingkart.com/business-loans/interest-rate-charges",
        sourceVerifiedAt: "2026-10-28",
        dataStatus: "published_starting_rate_needs_periodic_reverification",
    },

    // AU Small Finance Bank — Micro Business Loan
    {
        id: "au-sfb-micro-business-loan",
        lenderName: "AU Small Finance Bank",
        lenderType: "small_finance_bank",
        loanType: "business",
        productName: "Micro Business Loan",

        minInterestRate: null,
        maxInterestRate: null,
        minCreditScore: null,
        minBusinessVintageYears: null,

        minLoanAmount: null,
        maxLoanAmount: 1000000,
        minTenureMonths: null,
        maxTenureMonths: 60,

        processingFeeMaxPercent: 3,
        processingFeeIncludesTax: false,

        officialProductUrl:
            "https://www.au.bank.in/personal-banking/loans/micro-business-loan",
        sourceVerifiedAt: "2026-10-28",
        dataStatus: "published_limits_rate_needs_confirmation",
    },
];

module.exports = loanProducts;