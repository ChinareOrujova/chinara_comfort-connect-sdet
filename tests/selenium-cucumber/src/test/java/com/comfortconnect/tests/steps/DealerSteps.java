package com.comfortconnect.tests.steps;

import com.comfortconnect.tests.pages.CompanyBannerPage;
import com.comfortconnect.tests.pages.SystemSelectionPage;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;

import static org.assertj.core.api.Assertions.assertThat;

public class DealerSteps {

    private final CompanyBannerPage bannerPage = new CompanyBannerPage();
    private final SystemSelectionPage systemPage = new SystemSelectionPage();

    @Given("the dealer {string} is selected")
    public void theDealerIsSelected(String dealerName) {
        bannerPage.selectDealer(dealerName);
    }

    @When("the user switches the dealer to {string}")
    public void theUserSwitchesDealerTo(String dealerName) {
        bannerPage.selectDealer(dealerName);
    }

    @Then("the selected dealer is {string}")
    public void theSelectedDealerIs(String expected) {
        assertThat(bannerPage.getSelectedDealer()).isEqualTo(expected);
    }

    @Then("the dealer switch confirmation modal is displayed")
    public void theDealerSwitchModalIsDisplayed() {
        assertThat(bannerPage.isSwitchModalVisible()).isTrue();
    }

    @When("the user confirms the dealer switch")
    public void theUserConfirmsDealerSwitch() {
        bannerPage.confirmDealerSwitch();
    }

    @When("the user cancels the dealer switch")
    public void theUserCancelsDealerSwitch() {
        bannerPage.cancelDealerSwitch();
    }

    @Then("the application is reset to step 1")
    public void theApplicationIsResetToStep1() {
        systemPage.waitForPage();
        assertThat(systemPage.getAddedSystemCount()).isZero();
    }
}
