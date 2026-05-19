package com.comfortconnect.tests.steps;

import com.comfortconnect.tests.pages.*;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.assertj.core.api.Assertions.assertThat;

public class ApplicationFormSteps {

    private final SystemSelectionPage systemPage = new SystemSelectionPage();
    private final ApplicantInfoPage applicantPage = new ApplicantInfoPage();
    private final IncomeInfoPage incomePage = new IncomeInfoPage();
    private final ReviewSubmitPage reviewPage = new ReviewSubmitPage();

    // ── Step 1: System Selection ────────────────────────────────────────────────

    @Given("the homeowner adds a {string} system priced at {string}")
    public void theHomeownerAddsASystem(String systemType, String price) {
        systemPage.waitForPage();
        systemPage.addSystem(systemType, price);
    }

    @When("the homeowner proceeds from system selection")
    public void theHomeownerProceedsFromSystemSelection() {
        systemPage.clickNext();
    }

    @Then("the system is added to the cart")
    public void theSystemIsAddedToCart() {
        assertThat(systemPage.getAddedSystemCount()).isGreaterThan(0);
    }

    @Then("{int} system\\(s) are in the cart")
    public void nSystemsAreInTheCart(int count) {
        assertThat(systemPage.getAddedSystemCount()).isEqualTo(count);
    }

    @When("the homeowner tries to add a fourth system")
    public void theHomeownerTriesToAddAFourthSystem() {
        systemPage.tryToAddSystemWhenAtMax("HVAC");
    }

    @Then("the system selection shows a maximum systems error")
    public void theSystemSelectionShowsMaxSystemsError() {
        assertThat(systemPage.isAddToCartDisabled()).isTrue();
    }

    @Then("the cart still contains {int} systems")
    public void theCartStillContains(int count) {
        assertThat(systemPage.getAddedSystemCount()).isEqualTo(count);
    }

    @When("the homeowner tries to proceed without adding any system")
    public void theHomeownerTriesToProceedWithoutSystem() {
        systemPage.clickNext();
    }

    @Then("an error is shown requiring at least one system")
    public void anErrorIsShownRequiringAtLeastOneSystem() {
        assertThat(systemPage.isErrorDisplayed()).isTrue();
    }

    @When("the homeowner removes the first system from the cart")
    public void theHomeownerRemovesFirstSystem() {
        systemPage.removeSystem(0);
    }

    @Then("the cart is empty")
    public void theCartIsEmpty() {
        assertThat(systemPage.getAddedSystemCount()).isZero();
    }

    // ── Step 2: Applicant Info ──────────────────────────────────────────────────

    @Given("the homeowner fills in applicant information for {string}")
    public void theHomeownerFillsApplicantInfoFor(String profile) {
        applicantPage.waitForPage();
        ProfileData data = ProfileData.get(profile);
        applicantPage.fillApplicantInfo(
            data.firstName, data.lastName, data.email,
            data.phone, data.dob, data.ssn
        );
        applicantPage.fillAddress(data.street, data.city, data.state, data.zip);
    }

    @When("the homeowner proceeds from applicant info")
    public void theHomeownerProceedsFromApplicantInfo() {
        applicantPage.clickNext();
    }

    @Then("applicant info validation errors are shown")
    public void applicantInfoValidationErrorsAreShown() {
        assertThat(applicantPage.getErrorCount()).isGreaterThan(0);
    }

    @When("the homeowner submits the applicant form with no data")
    public void theHomeownerSubmitsApplicantFormWithNoData() {
        applicantPage.waitForPage();
        applicantPage.clickNext();
    }

    @When("the homeowner enters an invalid email {string}")
    public void theHomeownerEntersInvalidEmail(String email) {
        applicantPage.waitForPage();
        applicantPage.fillApplicantInfo("Test", "User", email, "5551234567", "01/01/1990", "123456789");
        applicantPage.fillAddress("123 Main St", "Austin", "TX", "78701");
        applicantPage.clickNext();
    }

    @When("the homeowner enters a DOB for someone under 18 {string}")
    public void theHomeownerEntersDobUnder18(String dob) {
        applicantPage.waitForPage();
        applicantPage.fillApplicantInfo("Test", "User", "test@example.com", "5551234567", dob, "123456789");
        applicantPage.fillAddress("123 Main St", "Austin", "TX", "78701");
        applicantPage.clickNext();
    }

    @When("the homeowner enters an invalid SSN {string}")
    public void theHomeownerEntersInvalidSsn(String ssn) {
        applicantPage.waitForPage();
        applicantPage.fillApplicantInfo("Test", "User", "test@example.com", "5551234567", "01/01/1990", ssn);
        applicantPage.fillAddress("123 Main St", "Austin", "TX", "78701");
        applicantPage.clickNext();
    }

    // ── Step 3: Income Info ─────────────────────────────────────────────────────

    @Given("the homeowner fills in income information for {string}")
    public void theHomeownerFillsIncomeInfoFor(String profile) {
        incomePage.waitForPage();
        ProfileData data = ProfileData.get(profile);
        incomePage.fillIncomeInfo(
            data.incomeSource,
            String.valueOf(data.preTaxIncome),
            data.additionalIncome > 0 ? String.valueOf(data.additionalIncome) : "",
            String.valueOf(data.housingExpense)
        );
    }

    @When("the homeowner proceeds from income info")
    public void theHomeownerProceedsFromIncomeInfo() {
        incomePage.clickNext();
    }

    @When("the homeowner submits the income form with no data")
    public void theHomeownerSubmitsIncomeFormWithNoData() {
        incomePage.waitForPage();
        incomePage.clickNext();
    }

    @Then("income info validation errors are shown")
    public void incomeInfoValidationErrorsAreShown() {
        assertThat(incomePage.getErrorCount()).isGreaterThan(0);
    }

    // ── Step 4: Review & Submit ─────────────────────────────────────────────────

    @When("the homeowner reviews and submits the application")
    public void theHomeownerReviewsAndSubmits() {
        reviewPage.waitForPage();
        reviewPage.acceptTermsAndSubmit();
    }

    @Then("the submit button is disabled without accepting terms")
    public void theSubmitButtonIsDisabledWithoutTerms() {
        reviewPage.waitForPage();
        assertThat(reviewPage.isSubmitEnabled()).isFalse();
    }

    @When("the homeowner accepts the terms")
    public void theHomeownerAcceptsTerms() {
        reviewPage.waitForPage();
        reviewPage.acceptTerms();
    }

    @Then("the submit button becomes enabled")
    public void theSubmitButtonBecomesEnabled() {
        assertThat(reviewPage.isSubmitEnabled()).isTrue();
    }
}
