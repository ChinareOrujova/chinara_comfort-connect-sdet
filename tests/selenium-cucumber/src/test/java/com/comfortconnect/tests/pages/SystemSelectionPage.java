package com.comfortconnect.tests.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class SystemSelectionPage extends BasePage {

    // Exclude BEM child elements (system-card__icon, system-card__name) by rejecting "__"
    private final By systemCards = By.xpath("//*[contains(@class,'system-card') and not(contains(@class,'system-card__')) and not(contains(@class,'system-card--disabled'))]");
    private final By priceInput = By.xpath("//*[contains(@class,'price-input-wrapper')]//input[@type='number']");
    private final By addToCartButton = By.xpath("//button[contains(@class,'btn-add-cart')]");
    private final By nextButton = By.xpath("//button[normalize-space()='Next']");
    private final By projectItems = By.xpath("//*[contains(@class,'project-item')]");
    private final By removeButtons = By.xpath("//button[contains(@class,'btn-remove')]");
    private final By fieldError = By.xpath("//*[contains(@class,'field-error')]");
    private final By totalDisplay = By.xpath("//*[contains(@class,'projects-total')]");
    private final By stepHeading = By.xpath("//*[contains(@class,'system-cards')]");

    public void waitForPage() {
        waitForVisible(stepHeading);
    }

    public List<WebElement> getAvailableSystemCards() {
        return waitForAllVisible(systemCards);
    }

    public void selectSystemType(String systemType) {
        By cardName = By.xpath("//div[contains(@class,'system-card__name') and normalize-space()='" + systemType + "']");
        waitForClickable(cardName).click();
        By selectedCard = By.xpath("//*[contains(@class,'system-card--selected')]");
        wait.until(d -> !d.findElements(selectedCard).isEmpty());
    }

    public void enterRetailPrice(String price) {
        WebElement input = waitForClickable(priceInput);
        input.clear();
        input.sendKeys(price);
    }

    public void clickAddToCart() {
        int countBefore = driver.findElements(projectItems).size();
        waitForClickable(addToCartButton).click();
        // Wait until React re-renders and the new project-item appears in the DOM
        wait.until(d -> d.findElements(projectItems).size() > countBefore);
    }

    public void addSystem(String systemType, String price) {
        selectSystemType(systemType);
        enterRetailPrice(price);
        clickAddToCart();
    }

    public void tryToAddSystemWhenAtMax(String systemType) {
        // Click the card name — atMaxSystems blocks state change, this is a no-op
        By cardName = By.xpath("//div[contains(@class,'system-card__name') and normalize-space()='" + systemType + "']");
        waitForClickable(cardName).click();
    }

    public boolean isAddToCartDisabled() {
        List<WebElement> buttons = driver.findElements(addToCartButton);
        return !buttons.isEmpty() && !buttons.get(0).isEnabled();
    }

    public void clickNext() {
        waitForClickable(nextButton).click();
    }

    public int getAddedSystemCount() {
        return driver.findElements(projectItems).size();
    }

    public void removeSystem(int index) {
        List<WebElement> buttons = driver.findElements(removeButtons);
        buttons.get(index).click();
    }

    public String getErrorMessage() {
        return waitForVisible(fieldError).getText();
    }

    public boolean isErrorDisplayed() {
        return isElementPresent(fieldError);
    }

    public boolean isNextButtonEnabled() {
        List<WebElement> buttons = driver.findElements(nextButton);
        return !buttons.isEmpty() && buttons.get(0).isEnabled();
    }

    public String getTotalDisplay() {
        List<WebElement> totals = driver.findElements(totalDisplay);
        return totals.isEmpty() ? "" : totals.get(0).getText();
    }
}
