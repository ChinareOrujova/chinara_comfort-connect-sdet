package com.comfortconnect.tests.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class IncomeInfoPage extends BasePage {

    private final By incomeSourceSelect = By.xpath("//*[@id='field-incomeSource']");
    private final By preTaxIncomeInput = By.xpath("//*[@id='field-preTaxAnnualIncome']");
    private final By additionalIncomeInput = By.xpath("//*[@id='field-additionalAnnualIncome']");
    private final By housingExpenseInput = By.xpath("//*[@id='field-monthlyHousingExpense']");

    private final By nextButton = By.xpath("//button[normalize-space()='Next']");
    private final By backButton = By.xpath("//button[normalize-space()='Back']");
    private final By fieldErrors = By.xpath("//*[contains(@class,'field-error')]");

    public void waitForPage() {
        waitForVisible(incomeSourceSelect);
    }

    public void fillIncomeInfo(String incomeSource, String preTaxIncome,
                                String additionalIncome, String housingExpense) {
        new Select(waitForVisible(incomeSourceSelect)).selectByVisibleText(incomeSource);
        type(preTaxIncomeInput, preTaxIncome);
        if (additionalIncome != null && !additionalIncome.isEmpty()) {
            type(additionalIncomeInput, additionalIncome);
        }
        type(housingExpenseInput, housingExpense);
    }

    private void type(By locator, String value) {
        WebElement el = waitForClickable(locator);
        el.clear();
        el.sendKeys(value);
    }

    public void clickNext() {
        waitForClickable(nextButton).click();
    }

    public void clickBack() {
        waitForClickable(backButton).click();
    }

    public int getErrorCount() {
        return driver.findElements(fieldErrors).size();
    }
}
