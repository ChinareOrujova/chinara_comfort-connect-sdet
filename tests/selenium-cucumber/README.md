# Comfort Connect – Selenium Cucumber BDD Tests

End-to-end test suite for the Comfort Connect financing platform, written in **Java 17** using **Selenium 4 + Cucumber BDD (JUnit 4)** with the **Page Object Model** pattern.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Language | Java 17 |
| Build | Maven |
| Browser automation | Selenium WebDriver 4 |
| Driver management | WebDriverManager (auto-downloads ChromeDriver) |
| BDD framework | Cucumber-JVM 7 + JUnit 4 |
| Assertions | AssertJ |

---

## Prerequisites

- **Java 11+** (Selenium 4 requires Java 11 minimum; Java 17 LTS recommended)
- **Maven 3.8+**
- **Google Chrome** installed
- The Comfort Connect app running locally (`npm run dev` from the repo root)

### Installing Java 17 and Maven on macOS

```bash
# Install Homebrew if not present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java 17 and Maven
brew install openjdk@17 maven

# Add Java to your PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"

# Verify
java -version    # should show 17.x
mvn --version    # should show 3.x
```

---

## Running the Tests

```bash
# From the tests/selenium-cucumber directory

# Run all tests (headless Chrome, default)
mvn test

# Run with a visible browser window
mvn test -Dheadless=false

# Run tests against a different URL
mvn test -Dapp.url=http://localhost:3000

# Run only a specific tag
mvn test -Dcucumber.filter.tags="@premier"

# Run only waterfall scenarios
mvn test -Dcucumber.filter.tags="@waterfall"
```

HTML report is generated at `target/cucumber-reports/report.html` after each run.

---

## Project Structure

```
src/test/
├── java/com/comfortconnect/tests/
│   ├── runners/
│   │   └── TestRunner.java          # JUnit + Cucumber entry point
│   ├── pages/                       # Page Object Model
│   │   ├── BasePage.java            # Shared WebDriverWait helpers
│   │   ├── CompanyBannerPage.java   # Dealer dropdown + switch modal
│   │   ├── SystemSelectionPage.java # Step 1 – system cards + cart
│   │   ├── ApplicantInfoPage.java   # Step 2 – personal info form
│   │   ├── IncomeInfoPage.java      # Step 3 – income form
│   │   ├── ReviewSubmitPage.java    # Step 4 – terms + submit
│   │   └── DecisionPage.java        # All decision/waterfall screens
│   └── steps/
│       ├── Hooks.java               # Before/After (driver lifecycle + screenshots)
│       ├── DealerSteps.java         # Dealer selection step definitions
│       ├── ApplicationFormSteps.java# Form step definitions (steps 1-4)
│       ├── DecisionSteps.java       # Decision/waterfall step definitions
│       └── ProfileData.java         # Test data (mirrors mockProfiles.json)
└── resources/
    ├── cucumber.properties
    └── features/
        ├── 01_dealer_selection.feature    # Dealer banner & switch modal
        ├── 02_system_selection.feature    # Step 1: system cart rules
        ├── 03_form_validation.feature     # Required field & format validation
        ├── 04_waterfall_premier.feature   # Alice & Bob – Premier approved
        ├── 05_waterfall_loans.feature     # Carol & Dan – loan partner offers
        ├── 06_waterfall_lto.feature       # Frank – Lease-to-Own fallback
        └── 07_waterfall_all_rejected.feature # Eve – all options exhausted
```

---

## Test Profiles

The `ProfileData` class mirrors `mockProfiles.json`. These six profiles exercise every branch of the financing waterfall:

| Profile | FICO | Expected Path |
|---|---|---|
| Alice | 760 (primePlus) | Premier approved → Accept or Decline |
| Bob | 701 (prime) | Premier approved |
| Carol | 630 (subPrime) | Review required → Loan offers auto-shown |
| Dan | 590 | Rejected → Loan offers shown |
| Frank | 555 | Rejected; below Loan1 FICO min → LTO only |
| Eve | 750, income $20K | Rejected on income; all partners reject |

---

## Tags

| Tag | Scenarios covered |
|---|---|
| `@dealer` | Dealer selection & switch modal |
| `@system-selection` | Step 1 cart rules |
| `@validation` | Form field validation |
| `@waterfall` | All waterfall scenarios |
| `@premier` | Premier approved scenarios |
| `@loans` | Loan partner scenarios |
| `@lto` | Lease-to-Own scenarios |
| `@rejected` | All-rejected / application declined |
| `@skip` | Excluded from default run |

---

## Failure Screenshots

On any failing scenario, a screenshot is automatically attached to the Cucumber HTML report.
