@waterfall @premier
Feature: Financing Waterfall – Premier Program
  As a creditworthy homeowner
  I want to see the Premier in-house financing offer after submitting
  So that I can accept or decline the best rate available

  Background:
    Given the dealer "Acme Heating & Air" is selected

  Scenario: Alice (primePlus FICO 760) is approved for Premier
    Given the homeowner adds a "HVAC" system priced at "8000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Alice"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Alice"
    And the homeowner proceeds from income info
    When the homeowner reviews and submits the application
    And the application is processed
    Then the Premier Program offer is displayed

  Scenario: Bob (prime FICO 701) is approved for Premier
    Given the homeowner adds a "HVAC" system priced at "12000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Bob"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Bob"
    And the homeowner proceeds from income info
    When the homeowner reviews and submits the application
    And the application is processed
    Then the Premier Program offer is displayed

  Scenario: Accepting the Premier offer ends the application
    Given the homeowner adds a "HVAC" system priced at "8000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Alice"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Alice"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    And the Premier Program offer is displayed
    When the homeowner accepts the Premier offer
    Then the offer selected confirmation screen is shown

  Scenario: Declining Premier shows loan offers with rollback option
    Given the homeowner adds a "HVAC" system priced at "8000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Alice"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Alice"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    And the Premier Program offer is displayed
    When the homeowner declines the Premier offer
    Then loan partner offers are displayed
    And the rollback to Premier link is visible

  Scenario: Rolling back to Premier after declining restores the offer
    Given the homeowner adds a "HVAC" system priced at "8000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Alice"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Alice"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    And the Premier Program offer is displayed
    And the homeowner declines the Premier offer
    And loan partner offers are displayed
    When the homeowner clicks the rollback to Premier link
    Then the Premier Program offer is displayed
