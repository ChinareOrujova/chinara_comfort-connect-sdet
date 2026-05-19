@waterfall @loans
Feature: Financing Waterfall – Loan Partners
  As a homeowner who is ineligible for Premier
  I want to see loan partner offers automatically
  So that I have an alternative financing path

  Background:
    Given the dealer "Acme Heating & Air" is selected

  Scenario: Carol (FICO 630, review required) skips Premier and sees loan offers
    Given the homeowner adds a "HVAC" system priced at "6000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Carol"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Carol"
    And the homeowner proceeds from income info
    When the homeowner reviews and submits the application
    And the application is processed
    Then the Premier Program offer is not displayed
    And loan partner offers are displayed

  Scenario: Dan (FICO 590, rejected) skips Premier and sees loan offers
    Given the homeowner adds a "HVAC" system priced at "7000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Dan"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Dan"
    And the homeowner proceeds from income info
    When the homeowner reviews and submits the application
    And the application is processed
    Then the Premier Program offer is not displayed
    And loan partner offers are displayed

  Scenario: Carol sees at least 2 loan offers (Loan1 FICO min 560, Loan2 FICO min 580 – both pass 630)
    Given the homeowner adds a "HVAC" system priced at "6000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Carol"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Carol"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    Then at least 2 loan offer(s) are shown

  Scenario: Rejected applicant sees no rollback-to-Premier link on loan offers
    Given the homeowner adds a "HVAC" system priced at "7000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Dan"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Dan"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    Then the rollback to Premier link is not visible

  Scenario: Selecting a loan offer ends the application
    Given the homeowner adds a "HVAC" system priced at "6000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Carol"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Carol"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    And loan partner offers are displayed
    When the homeowner selects the first loan offer
    Then the offer selected confirmation screen is shown
