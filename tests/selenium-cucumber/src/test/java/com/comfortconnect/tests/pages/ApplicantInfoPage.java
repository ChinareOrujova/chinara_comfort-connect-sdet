package com.comfortconnect.tests.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class ApplicantInfoPage extends BasePage {

    // Field IDs follow the pattern: field-{name} from FormField.jsx
    private final By firstNameInput = By.xpath("//*[@id='field-firstName']");
    private final By lastNameInput = By.xpath("//*[@id='field-lastName']");
    private final By emailInput = By.xpath("//*[@id='field-email']");
    private final By phoneInput = By.xpath("//*[@id='field-phone']");
    private final By dobInput = By.xpath("//*[@id='field-dateOfBirth']");
    private final By ssnInput = By.xpath("//*[@id='field-ssn']");
    private final By streetInput = By.xpath("//*[@id='field-street']");
    private final By cityInput = By.xpath("//*[@id='field-city']");
    private final By stateSelect = By.xpath("//*[@id='field-state']");
    private final By zipCodeInput = By.xpath("//*[@id='field-zipCode']");

    private final By nextButton = By.xpath("//button[normalize-space()='Next']");
    private final By backButton = By.xpath("//button[normalize-space()='Back']");
    private final By fieldErrors = By.xpath("//*[contains(@class,'field-error')]");
    private final By stepHeading = By.xpath("//*[contains(text(),'Step 2') or contains(text(),'Applicant')]");

    public void waitForPage() {
        waitForVisible(firstNameInput);
    }

    public void fillApplicantInfo(String firstName, String lastName, String email,
                                   String phone, String dob, String ssn) {
        type(firstNameInput, firstName);
        type(lastNameInput, lastName);
        type(emailInput, email);
        type(phoneInput, phone);
        type(dobInput, dob);
        type(ssnInput, ssn);
    }

    public void fillAddress(String street, String city, String state, String zip) {
        type(streetInput, street);
        type(cityInput, city);
        new Select(waitForVisible(stateSelect)).selectByValue(state);
        type(zipCodeInput, zip);
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

    public boolean isFieldErrorDisplayed(String fieldName) {
        By fieldContainer = By.cssSelector(".form-field:has(#field-" + fieldName + ") .field-error");
        return isElementPresent(fieldContainer);
    }

    public int getErrorCount() {
        return driver.findElements(fieldErrors).size();
    }
}
