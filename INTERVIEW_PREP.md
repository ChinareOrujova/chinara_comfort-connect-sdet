# Interview Preparation — SDET Take-Home Walkthrough

---

## Agenda

1. Walkthrough of your testing approach
2. Live demonstration of a test
3. Discussion on your testing strategy, tools, and thought process

---

## Part 1: Walkthrough of Your Testing Approach

**What to say:**
"I implemented a Selenium WebDriver + Cucumber BDD framework in Java, following the Page Object Model pattern.
The test suite covers the full financing application flow end-to-end across all 7 feature files and 33 scenarios."

**Key points to cover:**

- **BDD with Cucumber** — feature files written in Gherkin (Given/When/Then) so non-technical stakeholders
  can read and validate test coverage
- **Page Object Model** — each screen has its own class (SystemSelectionPage, ApplicantInfoPage, DecisionPage, etc.)
  that encapsulates all locators and actions, keeping step definitions clean
- **Test profiles** — 6 realistic personas with different FICO scores and income levels,
  each designed to exercise a specific branch of the financing waterfall
- **Feature file organization** — 7 files grouped by domain:
  dealer selection, system selection, form validation, and 4 waterfall scenarios

### Test Profiles

| Profile | FICO | Income    | Key Scenario                        |
|---------|------|-----------|-------------------------------------|
| Alice   | 760  | $120K/yr  | Premier approved                    |
| Bob     | 720  | $95K/yr   | Premier → declines → accepts loan   |
| Carol   | 630  | $75K/yr   | Loan partners only (2 offers)       |
| Dan     | 600  | $60K/yr   | Single loan partner                 |
| Frank   | 555  | $55K/yr   | Lease-to-Own path                   |
| Eve     | 750  | $20K/yr   | All options declined (low income)   |

### Financing Waterfall

```
Premier Program
    ↓ (if declined or ineligible)
Loan Partners (Loan1, Loan2)
    ↓ (if both decline)
Lease-to-Own (LTO1, LTO2)
    ↓ (if ineligible or not enrolled)
Application Declined
```

---

## Part 2: Live Demonstration

**Recommended scenario:** Alice — Premier Program approval (feature 04)
It is the most visual — goes through all 4 form steps, shows the processing animation,
and lands on the Premier offer card.

**How to run it:**
1. Open IntelliJ
2. Open `04_waterfall_premier.feature`
3. Right-click the first scenario → Run
4. Add `-Dstep.delay=1000` in VM options to slow it down so the interviewer can follow along

**What to narrate while it runs:**

- "The @BeforeAll hook checks if the server is up and starts it automatically if not"
- "Each scenario gets a fresh browser via @Before — no shared state between tests"
- "Here it is selecting the system card — I targeted the system-card__name element specifically
   because of how React's BEM class naming works with XPath"
- "Now filling the applicant form using the Alice profile data"
- "This pause is the real processing animation — I use a 20-second explicit wait to handle it"
- "And here is the Premier offer card appearing — test passes"

**How to open the Cucumber report after running:**
```bash
open target/cucumber-reports/report.html
```

**How to open the Allure report after running:**
```bash
mvn allure:serve
```

---

## Part 3: Testing Strategy, Tools, and Thought Process

### Framework Choices

| Tool | Why |
|------|-----|
| Selenium 4 + WebDriverManager | Auto-manages ChromeDriver, no manual driver downloads |
| Cucumber 7 + JUnit 4 | BDD layer keeps tests readable, feature files as living documentation |
| AssertJ | Fluent assertions with clear failure messages |
| XPath over CSS | Requirement of the assessment; XPath allows text-based matching that CSS cannot |
| Allure | Rich reporting with screenshots on failure, step-level detail |

### Key Challenges and How You Solved Them

1. **React state timing**
   After clicking "Add to Cart", React re-renders asynchronously.
   Fixed by waiting for the project-item count to increase rather than using a fixed sleep.

2. **BEM XPath false matches**
   `contains(@class,'system-card')` also matched system-card__icon and system-card__name child elements.
   Fixed by targeting system-card__name directly for clicks and waiting for system-card--selected
   to confirm React committed the state update.

3. **Financing waterfall logic**
   Had to read the backend service code to understand exactly when leaseToOwnPartnerApplyEligible
   is false and the app skips directly to declined, rather than guessing from the UI.

4. **IntelliJ vs Maven execution**
   Added cucumber.properties with the glue path so step definitions are found
   regardless of how the test is invoked.

5. **Auto server startup**
   Added a @BeforeAll hook that checks if localhost:3000 is up and starts
   the app automatically if not — no manual server start needed.

### What You Would Add With More Time

- Parallel execution across scenarios (DriverManager already uses ThreadLocal for thread safety)
- Allure @Step annotations for richer step-level reporting
- CI pipeline with GitHub Actions to run headless on every PR
- Data-driven tests using Cucumber Scenario Outline for boundary FICO values
- Visual regression testing for the decision screen UI

---

## Quick Reference — How to Run

### Run all tests
```bash
mvn test -Dheadless=true
```

### Run a specific feature
```bash
mvn test -Dcucumber.filter.tags="@premier"
```

### Run with visible browser and slow steps
```bash
mvn test -Dheadless=false -Dstep.delay=1000
```

### Open Cucumber report
```bash
open target/cucumber-reports/report.html
```

### Open Allure report
```bash
mvn allure:serve
```

---

*Good luck tomorrow!*
