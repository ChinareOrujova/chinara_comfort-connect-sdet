package com.comfortconnect.tests.steps;

import com.comfortconnect.tests.pages.DecisionPage;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.assertj.core.api.Assertions.assertThat;

public class DecisionSteps {

    private final DecisionPage decisionPage = new DecisionPage();

    @When("the application is processed")
    public void theApplicationIsProcessed() {
        decisionPage.waitForProcessingToFinish();
    }

    // ── Premier ──────────────────────────────────────────────────────────────────

    @Then("the Premier Program offer is displayed")
    public void thePremierOfferIsDisplayed() {
        assertThat(decisionPage.isPremierApprovalDisplayed())
            .as("Premier approval card should be visible")
            .isTrue();
    }

    @Then("the Premier Program offer is not displayed")
    public void thePremierOfferIsNotDisplayed() {
        assertThat(decisionPage.isPremierApprovalDisplayed())
            .as("Premier card should NOT appear for rejected/review applicants")
            .isFalse();
    }

    @When("the homeowner accepts the Premier offer")
    public void theHomeownerAcceptsPremierOffer() {
        decisionPage.acceptPremierOffer();
    }

    @When("the homeowner declines the Premier offer")
    public void theHomeownerDeclinesPremierOffer() {
        decisionPage.declinePremierOffer();
    }

    // ── Partner offers (loans / LTO) ──────────────────────────────────────────────

    @Then("loan partner offers are displayed")
    public void loanPartnerOffersAreDisplayed() {
        assertThat(decisionPage.arePartnerOffersDisplayed())
            .as("Loan partner offer cards should be visible")
            .isTrue();
    }

    @Then("at least {int} loan offer\\(s) are shown")
    public void atLeastNLoanOffersAreShown(int minCount) {
        assertThat(decisionPage.getOfferCount()).isGreaterThanOrEqualTo(minCount);
    }

    @When("the homeowner selects the first loan offer")
    public void theHomeownerSelectsFirstLoanOffer() {
        decisionPage.selectOffer(0);
    }

    @Then("the rollback to Premier link is visible")
    public void theRollbackToPremierLinkIsVisible() {
        assertThat(decisionPage.isRollbackToPremierVisible()).isTrue();
    }

    @Then("the rollback to Premier link is not visible")
    public void theRollbackToPremierLinkIsNotVisible() {
        assertThat(decisionPage.isRollbackToPremierVisible()).isFalse();
    }

    @When("the homeowner clicks the rollback to Premier link")
    public void theHomeownerClicksRollbackToPremier() {
        decisionPage.clickRollbackToPremier();
    }

    // ── Loan declined → LTO ───────────────────────────────────────────────────────

    @Then("the loan declined screen is shown with a Lease-to-Own option")
    public void theLoanDeclinedScreenIsShownWithLtoOption() {
        assertThat(decisionPage.isLoanDeclinedScreenDisplayed())
            .as("Loan declined screen should be visible")
            .isTrue();
    }

    @When("the homeowner applies for Lease-to-Own")
    public void theHomeownerAppliesForLeaseToOwn() {
        decisionPage.clickApplyForLeaseToOwn();
    }

    @Then("Lease-to-Own offers are displayed")
    public void leaseToOwnOffersAreDisplayed() {
        assertThat(decisionPage.arePartnerOffersDisplayed())
            .as("LTO offer cards should be visible")
            .isTrue();
    }

    @When("the homeowner selects the first Lease-to-Own offer")
    public void theHomeownerSelectsFirstLtoOffer() {
        decisionPage.selectOffer(0);
    }

    // ── Terminal states ───────────────────────────────────────────────────────────

    @Then("the offer selected confirmation screen is shown")
    public void theOfferSelectedConfirmationScreenIsShown() {
        assertThat(decisionPage.isOfferSelectedDisplayed())
            .as("Offer selected screen should be visible")
            .isTrue();
    }

    @Then("the application declined screen is shown")
    public void theApplicationDeclinedScreenIsShown() {
        assertThat(decisionPage.isApplicationDeclinedDisplayed())
            .as("Application declined screen should be visible")
            .isTrue();
    }
}
