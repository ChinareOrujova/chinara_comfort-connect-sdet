package com.comfortconnect.tests.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;

import java.util.List;

public class ReviewSubmitPage extends BasePage {

    private final By termsCheckbox = By.xpath("//input[@type='checkbox']");
    private final By submitButton = By.xpath("//button[contains(text(),'Submit Application')]");
    private final By backButton = By.xpath("//button[normalize-space()='Back']");

    public void waitForPage() {
        waitForVisible(termsCheckbox);
    }

    public void acceptTerms() {
        WebElement checkbox = waitForClickable(termsCheckbox);
        if (!checkbox.isSelected()) {
            checkbox.click();
        }
    }

    public void clickSubmit() {
        waitForClickable(submitButton).click();
    }

    public void clickBack() {
        waitForClickable(backButton).click();
    }

    public boolean isSubmitEnabled() {
        List<WebElement> buttons = driver.findElements(submitButton);
        return !buttons.isEmpty() && buttons.get(0).isEnabled();
    }

    public void acceptTermsAndSubmit() {
        acceptTerms();
        clickSubmit();
    }
}
