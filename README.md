# Comfort Connect

A self-contained home comfort financing platform. Dealers (HVAC contractors) use it to help homeowners apply for financing. The homeowner fills out a 4-step application, the backend runs an underwriting engine, and based on the result the system walks the homeowner through a waterfall of financing options until they select an offer or exhaust all options.

No database, no external APIs, no auth. Everything runs locally in-memory.

---

## Running the Application

```bash
npm run install:all    # Install root + backend + frontend dependencies
npm run dev            # Start backend (:3001) + frontend (:3000) concurrently
```

---

## How the Application Works

### End-to-End Flow

```
  Dealer selects Company
          |
  Homeowner adds Systems (up to 3)
          |
  Fills Applicant Info
          |
  Fills Income Info
          |
  Reviews & Submits Application
          |
    [Underwriting Engine]
          |
     +----+----+--------+
     |         |        |
  APPROVED   REVIEW   REJECTED
     |       REQUIRED    |
     v         |         v
  Premier      |     Partner Offers
  Offer        |     (Loan + LTO)
     |         |         |
     v         v         |
  Accept/   Manual       +---> Loan1 / Loan2
  Decline   Review       |     (if enrolled)
     |         |         +---> L2O1 / L2O2
     |         |               (if enrolled)
     v         v
   [STOP: Offer Selected]
```

### 1. Dealer Selection

Before anything starts, a dealer (company) must be selected from the top banner. Each dealer has its own configuration that controls everything downstream: which system types are available, which financing partners are enrolled, the maximum approval amount, and a buydown rate that reduces the APR on Premier offers.

Three sample dealers are pre-configured:

| Dealer | Systems | Enrolled Partners | Max Approval | Buydown |
|--------|---------|-------------------|-------------|---------|
| Acme Heating & Air | All 5 types | All 5 partners | $40,000 | 2% |
| Sample HVAC Corp | HVAC, Water Heater | Premier, Loan1, Loan2 | $30,000 | None |
| Test Climate Services | HVAC, Generator, Water Filter/Softener | Premier, Loan1, L2O1, L2O2 | $50,000 | 3% |

Switching dealers mid-application resets all progress (with a confirmation modal).

### 2. Application Form (4 Steps)

**Step 1 -- System Selection:** The homeowner picks system types (HVAC, Water Heater, etc.) from cards filtered by the dealer's config, enters a retail price for each, and adds them to a cart. Up to 3 systems per application. The total cannot exceed the dealer's max approval amount.

**Step 2 -- Applicant Info:** Name, email, phone, date of birth, SSN, and full address. SSN is critical because the backend uses it to generate deterministic credit data (no real credit bureau exists).

**Step 3 -- Income Info:** Income source, pre-tax annual income, additional income, and monthly housing expense.

**Step 4 -- Review & Submit:** Summary of everything. Applicant accepts terms and submits. This triggers a `POST /api/apply` call that kicks off the entire backend flow.

### 3. What Happens on Submit

The backend orchestrator (`comfort.service.js`) receives the application and does the following in sequence:

1. **Creates a pipeline record** -- Stores the application in an in-memory `Map` with a generated application ID. This record tracks state throughout the flow.

2. **Pulls credit data** -- The SSN's last 4 digits are used as a seed to deterministically generate a credit profile: FICO score, bankruptcy/foreclosure counts, delinquencies, debt payments, and property values. Same SSN always produces the same data.

3. **Runs underwriting** -- The credit data plus the applicant's stated income are combined into an underwriting input object. This input is run through a rules engine -- a list of rejection rules and review rules, each with a simple boolean check. If any rejection rule fires, the decision is "rejected". If no rejections but a review rule fires, it's "review required". If nothing fires, it's "approved".

4. **Generates Premier pricing** (if approved) -- Looks up the base APR from a rate table based on the total project cost and the applicant's credit grade, subtracts the dealer's buydown rate, then calculates a monthly payment using standard amortization over 120 months.

5. **Returns the decision** to the frontend with the Premier offer (if approved) or just the decision status.

### 4. The Financing Waterfall

This is the core of the application. Financing options are offered in a strict order, and each stage is triggered **on-demand** -- the backend only calls a partner when the user reaches that stage.

**Stage 1 -- Premier Program (underwriting):**
The in-house financing option. Evaluated automatically on submit. Three possible outcomes:
- **Approved** -- The frontend shows the Premier offer with Accept/Decline buttons.
- **Review Required** -- Treated as a soft decline. The frontend skips Premier entirely and auto-fetches loan offers.
- **Rejected** -- Same behavior as review required. Auto-fetches loan offers.

**Stage 2 -- Loan Partners (on-demand):**
Triggered when the user declines Premier, or when Premier was rejected/review. The frontend calls `POST /offers/:id/loan`, which evaluates Loan1 and Loan2 (if enrolled for the dealer). Each partner has its own eligibility rules (minimum FICO, minimum income, max amount, eligible project types). Eligible partners return tiered offers with different APRs and terms. The frontend shows these as generic "Offer #1", "Offer #2" cards -- partner names are never revealed to the homeowner.

If Premier was approved and the user declined it to see loans, a rollback link appears: "No thanks, I'll go Worry-Free for $X/month!" -- clicking it returns to the Premier offer.

**Stage 3 -- Lease-to-Own Partners (on-demand):**
Triggered when loan partners reject or the user declines all loan offers. The frontend calls `POST /offers/:id/leaseToOwn`, which evaluates L2O1 and L2O2 (if enrolled). LTO partners have lower FICO requirements but charge a markup on the retail price (1.55x-1.70x). This is the last stop in the waterfall.

**Dead End:**
If no partner at any stage can make an offer, the homeowner sees "Your application couldn't be approved."

**Terminal State:**
Once the homeowner selects any offer (Premier, loan, or LTO), the application ends. In production, non-Premier selections would redirect to the partner's external portal.

---

## Underwriting -- Key Terms

The underwriting engine uses several financial metrics. Here's what they mean:

- **FICO** -- A credit score (550-849 in this system). Higher is better. The score determines the applicant's credit grade (primePlus, prime, nearPrime, subPrime, ungraded), which in turn determines the APR they're offered.

- **DTI (Debt-to-Income Ratio)** -- How much of the applicant's monthly income goes to debt payments. Calculated as `(monthlyDebt + housingExpense) / monthlyIncome * 100`. A DTI of 55% means 55 cents of every dollar earned goes to debt. High DTI = risky.

- **LTV (Loan-to-Value Ratio)** -- How much the applicant owes on their property vs what it's worth. `propertyLoan / propertyValue * 100`. An LTV of 90% means they owe 90% of their home's value. High LTV = little equity = risky.

- **ADV (Actual Deal Value)** -- The total retail price of all systems in the application. High-value projects for lower-credit applicants get flagged for review.

- **Credit Grade** -- Derived from FICO score:

| FICO Range | Grade | What It Means |
|------------|-------|---------------|
| 740-850 | primePlus | Best rates, most likely approved |
| 680-739 | prime | Good rates, likely approved |
| 640-679 | nearPrime | Higher rates, may trigger review |
| 580-639 | subPrime | Highest rates, likely triggers review or rejection |
| 0-579 | ungraded | Below threshold, rejected |

### Underwriting Rules

The engine evaluates all rules and takes the worst outcome (reject > review > approved).

**Rejection rules** (any one = rejected):
- FICO <= 594, or bankruptcy on record, or foreclosure on record
- 4+ delinquencies, or annual income <= $28,000
- FICO <= 639 combined with DTI > 55%

**Review rules** (any one = review required, if no rejections):
- FICO between 595-639 (borderline credit)
- FICO 640-679 with DTI > 55% (decent credit but overextended)
- ADV > $30,000 with FICO <= 739 (large project for credit tier)
- FICO <= 639 with LTV >= 85% (low credit + little home equity)

### Credit Data Generation

Since there's no real credit bureau, credit data is generated from the SSN. The last 4 digits become a seed: `fico = 550 + (seed % 300)`, giving a range of 550-849. Other fields (bankruptcy, foreclosure, delinquencies, debt) are similarly derived. Same SSN always produces the same result -- this makes testing deterministic.

---

## Pricing

### Premier APR

The APR is looked up from a rate table based on the total project cost and credit grade, then reduced by the dealer's buydown rate. Better credit and higher project values get lower APRs.

| Cost Range | primePlus | prime | nearPrime | subPrime |
|------------|-----------|-------|-----------|----------|
| $1K - $5K | 14.5% | 18.5% | 22.5% | 26.5% |
| $5K - $10K | 13.5% | 17.5% | 21.5% | 25.5% |
| $10K - $20K | 12.5% | 16.5% | 20.5% | 24.5% |
| $20K - $30K | 12.0% | 16.0% | 20.0% | 24.0% |
| $30K - $50K | 11.5% | 15.5% | 19.5% | 23.5% |

**Buydown example:** Acme Heating & Air has a 2% buydown. A primePlus applicant with a $12K project gets a base APR of 12.5%, reduced to 10.5% after buydown.

Monthly payment uses standard amortization: `(cost * APR/1200) / (1 - (1 + APR/1200)^(-120))`

### Partner Pricing

Loan partners use fixed APR tiers based on FICO. LTO partners don't use APR -- they multiply the retail price by a markup factor (1.55x or 1.70x) and divide into monthly payments.

---

## Partner Eligibility

Each partner has independent eligibility rules. A homeowner might qualify for one partner but not another.

| Partner | Type | Min FICO | Min Income | Max Amount |
|---------|------|----------|-----------|------------|
| Loan1 | Loan | 560 | $22K/year | $60,000 |
| Loan2 | Loan | 580 | $22K/year | $80,000 |
| L2O1 | Lease-to-Own | 520 | $1,800/month | $20,000 |
| L2O2 | Lease-to-Own | 520 | $2,500/month | $12,000 |

Notice the FICO thresholds create natural tiers: a FICO of 555 fails both loan partners but passes both LTO partners. A FICO of 570 passes Loan1 but not Loan2. This is what makes the waterfall work -- each stage catches applicants the previous stage couldn't serve.

Loan partners also restrict by project type (HVAC, Water Heater, Generator, Water Filter/Softener only). LTO partners accept any system type but have lower max amounts.

---

## API Reference

| Method | Endpoint | What It Does |
|--------|----------|-------------|
| GET | `/api/companies` | List dealers |
| GET | `/api/companies/:id` | Dealer config (systems, partners, buydown) |
| POST | `/api/apply` | Submit application → runs underwriting → returns decision |
| POST | `/api/offers/:id/loan` | Trigger loan partner evaluation (on-demand) |
| POST | `/api/offers/:id/leaseToOwn` | Trigger LTO partner evaluation (on-demand) |
| POST | `/api/offers/:id/select` | Select an offer (terminal) |
| GET | `/api/offers/:id` | Get current offers for an application |
| GET | `/api/pipeline/status/:id` | Get application pipeline status |

---

## Sample Test Data

These profiles are pre-configured in `mockProfiles.json` and exercise different paths through the waterfall:

| Profile | SSN (last 4) | FICO | What Happens |
|---------|-------------|------|-------------|
| Alice -- primePlus | 0210 | 760 | Premier approved. Best APR tier. |
| Bob -- prime | 4651 | 701 | Premier approved. Standard tier. |
| Carol -- subPrime | 0080 | 630 | Review required (midFico rule). Skips Premier, auto-shows loan offers. |
| Dan -- rejected | 0040 | 590 | Rejected (lowFico). Loan + LTO offers available. |
| Frank -- LTO only | 0005 | 555 | Rejected. FICO too low for loans (< 560). Only LTO partners approve. |
| Eve -- all rejected | 0500 | 750 | Great FICO but income is $20K -- below minimums for every partner. |

---

## Tech Stack

- **Frontend:** React 18 (hooks, no state library)
- **Backend:** Node.js + Express
- **Persistence:** None. In-memory `Map` on backend, React state on frontend. Server restart or page refresh clears everything.
- **Deterministic:** Same SSN always produces the same credit data and underwriting result.
