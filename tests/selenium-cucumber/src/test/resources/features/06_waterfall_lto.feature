@waterfall @lto
Feature: Financing Waterfall – Lease-to-Own Partners
  As a homeowner ineligible for both Premier and loans
  I want to be offered Lease-to-Own as a last resort
  So that I still have a path to financing

  Background:
    Given the dealer "Acme Heating & Air" is selected

  Scenario: Frank (FICO 555) is rejected by Premier and both loan partners
    # Loan1 requires FICO >= 560; Loan2 requires FICO >= 580. Frank's 555 fails both.
    Given the homeowner adds a "HVAC" system priced at "7000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Frank"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Frank"
    And the homeowner proceeds from income info
    When the homeowner reviews and submits the application
    And the application is processed
    Then the Premier Program offer is not displayed

  Scenario: Frank sees the loan declined screen with a Lease-to-Own option
    Given the homeowner adds a "HVAC" system priced at "7000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Frank"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Frank"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    Then the loan declined screen is shown with a Lease-to-Own option

  Scenario: Frank can proceed to Lease-to-Own offers
    Given the homeowner adds a "HVAC" system priced at "7000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Frank"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Frank"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    And the loan declined screen is shown with a Lease-to-Own option
    When the homeowner applies for Lease-to-Own
    Then Lease-to-Own offers are displayed

  Scenario: Frank selects a Lease-to-Own offer and the application ends
    Given the homeowner adds a "HVAC" system priced at "7000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Frank"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Frank"
    And the homeowner proceeds from income info
    And the homeowner reviews and submits the application
    And the application is processed
    And the loan declined screen is shown with a Lease-to-Own option
    And the homeowner applies for Lease-to-Own
    And Lease-to-Own offers are displayed
    When the homeowner selects the first Lease-to-Own offer
    Then the offer selected confirmation screen is shown

  Scenario: Dealer without LTO (Sample HVAC Corp) shows application declined for Frank
    # Sample HVAC Corp has l2o1/l2o2 not enrolled → leaseToOwnPartnerApplyEligible=false
    # When loans reject Frank the app jumps directly to the declined screen
    Given the dealer "Sample HVAC Corp" is selected
    And the homeowner adds a "HVAC" system priced at "7000"
    And the homeowner proceeds from system selection
    And the homeowner fills in applicant information for "Frank"
    And the homeowner proceeds from applicant info
    And the homeowner fills in income information for "Frank"
    And the homeowner proceeds from income info
    When the homeowner reviews and submits the application
    And the application is processed
    Then the application declined screen is shown
