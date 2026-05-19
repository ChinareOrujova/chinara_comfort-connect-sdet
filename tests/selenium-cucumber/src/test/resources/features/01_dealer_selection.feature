@dealer
Feature: Dealer Selection
  As a homeowner
  I want to see the correct dealer selected in the banner
  So that I get financing options configured for that dealer

  Scenario: Default dealer is pre-selected on page load
    Then the selected dealer is "Acme Heating & Air"

  Scenario: Switch dealer before starting an application
    When the user switches the dealer to "Sample HVAC Corp"
    Then the selected dealer is "Sample HVAC Corp"

  Scenario: Switching dealer mid-application shows confirmation modal
    Given the dealer "Acme Heating & Air" is selected
    And the homeowner adds a "HVAC" system priced at "8000"
    When the user switches the dealer to "Sample HVAC Corp"
    Then the dealer switch confirmation modal is displayed

  Scenario: Confirming dealer switch resets the application
    Given the dealer "Acme Heating & Air" is selected
    And the homeowner adds a "HVAC" system priced at "8000"
    When the user switches the dealer to "Sample HVAC Corp"
    And the user confirms the dealer switch
    Then the selected dealer is "Sample HVAC Corp"
    And the application is reset to step 1

  Scenario: Cancelling dealer switch preserves the current dealer and cart
    Given the dealer "Acme Heating & Air" is selected
    And the homeowner adds a "HVAC" system priced at "8000"
    When the user switches the dealer to "Sample HVAC Corp"
    And the user cancels the dealer switch
    Then the selected dealer is "Acme Heating & Air"
    And 1 system(s) are in the cart
