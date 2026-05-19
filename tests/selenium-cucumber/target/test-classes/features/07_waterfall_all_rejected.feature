@waterfall @rejected
Feature: Financing Waterfall – All Options Exhausted
  As a homeowner who cannot meet any partner's eligibility criteria
  I want to see a clear "could not be approved" message
  So that I understand no financing is available

  Background:
    Given the dealer "Acme Heating & Air" is selected

  Scenario: Eve (FICO 750, income $20K) is rejected by underwriting
    # Income $20K < $28K annual minimum → underwriting rejects
    Given the homeowner adds a "HVAC" system priced at "5000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Eve"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Eve"
    And the homeowner proceeds from income info
    When the homeowner reviews and submits the application
    And the application is processed
    Then the Premier Program offer is not displayed

  Scenario: Eve sees the application declined screen (all financing options exhausted)
    # Loans require $22K/year; LTO requires $1,800/month ($21.6K/yr); Eve earns $20K → all fail
    # leaseToOwnPartnerApplyEligible=false so app skips loanDeclined and goes straight to declined
    Given the homeowner adds a "HVAC" system priced at "5000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Eve"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Eve"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    Then the application declined screen is shown
