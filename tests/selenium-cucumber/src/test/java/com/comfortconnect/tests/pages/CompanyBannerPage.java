package com.comfortconnect.tests.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

public class CompanyBannerPage extends BasePage {

    private final By dealerDropdown = By.xpath("//select[contains(@class,'company-banner__select')]");
    private final By switchModalConfirm = By.xpath("//div[contains(@class,'modal')]//button[contains(@class,'btn-primary') or contains(@class,'btn-danger')]");
    private final By switchModalCancel = By.xpath("//*[contains(@class,'modal-cancel-link')]");
    private final By switchModal = By.xpath("//*[contains(@class,'modal') or contains(@class,'company-switch-modal')]");

    public void selectDealer(String dealerName) {
        WebElement dropdown = waitForClickable(dealerDropdown);
        new Select(dropdown).selectByVisibleText(dealerName);
    }

    public String getSelectedDealer() {
        WebElement dropdown = waitForVisible(dealerDropdown);
        return new Select(dropdown).getFirstSelectedOption().getText();
    }

    public boolean isSwitchModalVisible() {
        return isElementPresent(switchModal);
    }

    public void confirmDealerSwitch() {
        waitForClickable(switchModalConfirm).click();
    }

    public void cancelDealerSwitch() {
        waitForClickable(switchModalCancel).click();
    }
}
