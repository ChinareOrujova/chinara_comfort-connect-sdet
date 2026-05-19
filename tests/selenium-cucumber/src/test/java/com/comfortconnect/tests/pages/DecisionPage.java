package com.comfortconnect.tests.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

public class DecisionPage extends BasePage {

    // Processing screen
    private final By processingScreen = By.xpath("//*[contains(@class,'processing-screen') or contains(@class,'processing')]");

    // Premier approved
    private final By premierCard = By.xpath("//*[contains(@class,'premier-card') or contains(@class,'premier-approved')]");
    private final By acceptButton = By.xpath("//button[contains(@class,'btn-accept')]");
    private final By declineButton = By.xpath("//button[contains(@class,'btn-decline')]");

    // Premier decline modal ("Would you like to explore other financing offers?")
    private final By declineModalConfirm = By.xpath("//button[contains(@class,'btn-confirm')]");
    private final By declineModalCancel = By.xpath("//*[contains(@class,'modal-cancel-link')]");

    // Partner loan/LTO offers — use longWait: app enforces 5-second minimum processing
    private final By offerCards = By.xpath("//*[contains(@class,'offer-card')]");
    private final By selectOfferButtons = By.xpath("//button[contains(@class,'offer-card__button')]");
    private final By rollbackToPremierLink = By.xpath("//*[contains(text(),'Worry-Free')]");

    // Loan declined → LTO available
    private final By loanDeclinedScreen = By.xpath("//*[contains(@class,'loan-declined')]");
    private final By applyForLtoButton = By.xpath("//button[contains(@class,'btn-leaseToOwn')]");

    // Application fully declined
    private final By applicationDeclinedScreen = By.xpath("//*[contains(@class,'application-declined')]");
    private final By applicationDeclinedHeading = By.xpath("//*[contains(text(),'Could Not Be Approved')]");

    // Offer selected terminal screen — actual class: "decision-screen offer-selected"
    private final By offerSelectedScreen = By.xpath("//*[contains(@class,'offer-selected')]");

    public void waitForProcessingToFinish() {
        // Wait for processing screen to appear, then disappear
        try {
            wait.until(d -> !d.findElements(processingScreen).isEmpty());
        } catch (Exception ignored) { /* may appear too fast */ }
        longWait.until(d -> d.findElements(processingScreen).isEmpty());
    }

    // ── Premier ────────────────────────────────────────────────────────────────

    public boolean isPremierApprovalDisplayed() {
        return isElementPresent(premierCard);
    }

    public void acceptPremierOffer() {
        waitForClickable(acceptButton).click();
    }

    public void declinePremierOffer() {
        // Click Decline on the Premier card → modal appears
        waitForClickable(declineButton).click();
        // Click "Show me offers" in the confirmation modal to proceed to loan offers
        waitForClickable(declineModalConfirm).click();
    }

    // ── Partner offers ─────────────────────────────────────────────────────────

    public boolean arePartnerOffersDisplayed() {
        // App enforces a 5-second minimum processing delay before showing offers
        try {
            longWait.until(ExpectedConditions.visibilityOfElementLocated(offerCards));
            return true;
        } catch (TimeoutException e) {
            return false;
        }
    }

    public int getOfferCount() {
        // Reuse the longWait result — offers already visible after arePartnerOffersDisplayed()
        return driver.findElements(offerCards).size();
    }

    public void selectOffer(int index) {
        List<WebElement> buttons = wait.until(d -> {
            List<WebElement> btns = d.findElements(selectOfferButtons);
            return btns.size() > index ? btns : null;
        });
        buttons.get(index).click();
    }

    public boolean isRollbackToPremierVisible() {
        return isElementPresent(rollbackToPremierLink);
    }

    public void clickRollbackToPremier() {
        waitForClickable(rollbackToPremierLink).click();
    }

    // ── Loan declined ──────────────────────────────────────────────────────────

    public boolean isLoanDeclinedScreenDisplayed() {
        return isElementPresent(loanDeclinedScreen);
    }

    public void clickApplyForLeaseToOwn() {
        waitForClickable(applyForLtoButton).click();
    }

    // ── Application declined ───────────────────────────────────────────────────

    public boolean isApplicationDeclinedDisplayed() {
        return isElementPresent(applicationDeclinedScreen) || isElementPresent(applicationDeclinedHeading);
    }

    // ── Terminal: offer selected ───────────────────────────────────────────────

    public boolean isOfferSelectedDisplayed() {
        try {
            longWait.until(ExpectedConditions.visibilityOfElementLocated(offerSelectedScreen));
            return true;
        } catch (TimeoutException e) {
            return false;
        }
    }
}
