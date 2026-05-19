@validation
Feature: Application Form Validation
  As the application
  I want to validate all required fields before proceeding
  So that the backend receives clean and complete data

  Background:
    Given the dealer "Acme Heating & Air" is selected
    And the homeowner adds a "HVAC" system priced at "10000"
    And the homeowner proceeds from system selection

  Scenario: Applicant Info – all required fields blank
    When the homeowner submits the applicant form with no data
    Then applicant info validation errors are shown

  Scenario: Applicant Info – invalid email format
    When the homeowner enters an invalid email "notanemail"
    Then applicant info validation errors are shown

  Scenario: Applicant Info – underage date of birth
    When the homeowner enters a DOB for someone under 18 "01/01/2020"
    Then applicant info validation errors are shown

  Scenario: Income Info – all required fields blank
    Given the homeowner fills in applicant information for "Alice"
    And the homeowner proceeds from applicant info
    When the homeowner submits the income form with no data
    Then income info validation errors are shown

  Scenario Outline: Applicant Info – invalid SSN format: <reason>
    When the homeowner enters an invalid SSN "<ssn>"
    Then applicant info validation errors are shown

    Examples:
      | ssn         | reason              |
      | 12345678901 | more than 9 digits  |
      | 12345678    | fewer than 9 digits |
      | 12345678A   | alphanumeric        |
      | ABCDEFGHI   | alphabetic only     |

  Scenario: Review – submit button is disabled until terms are accepted
    Given the homeowner fills in applicant information for "Alice"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Alice"
    And the homeowner proceeds from income info
    Then the submit button is disabled without accepting terms
    When the homeowner accepts the terms
    Then the submit button becomes enabled
