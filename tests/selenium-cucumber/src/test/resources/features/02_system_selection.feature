@system-selection
Feature: System Selection (Step 1)
  As a homeowner
  I want to select and price the equipment I need
  So that I can request financing for the right amount

  Background:
    Given the dealer "Acme Heating & Air" is selected

  Scenario: Add a single system to the cart
    When the homeowner adds a "HVAC" system priced at "10000"
    Then the system is added to the cart
    And 1 system(s) are in the cart

  Scenario: Add up to three systems
    When the homeowner adds a "HVAC" system priced at "8000"
    And the homeowner adds a "Water Heater" system priced at "3000"
    And the homeowner adds a "Generator" system priced at "5000"
    Then 3 system(s) are in the cart

  Scenario: Cannot add a fourth system
    Given the homeowner adds a "HVAC" system priced at "8000"
    And the homeowner adds a "Water Heater" system priced at "3000"
    And the homeowner adds a "Generator" system priced at "5000"
    When the homeowner tries to add a fourth system
    Then the system selection shows a maximum systems error
    And the cart still contains 3 systems

  Scenario: Remove a system from the cart
    Given the homeowner adds a "HVAC" system priced at "8000"
    And the homeowner adds a "Water Heater" system priced at "3000"
    When the homeowner removes the first system from the cart
    Then 1 system(s) are in the cart

  Scenario: Cannot proceed without at least one system
    When the homeowner tries to proceed without adding any system
    Then an error is shown requiring at least one system

  Scenario: Proceed to applicant info after adding a system
    Given the homeowner adds a "HVAC" system priced at "10000"
    When the homeowner proceeds from system selection
    And the homeowner submits the applicant form with no data
    Then applicant info validation errors are shown
