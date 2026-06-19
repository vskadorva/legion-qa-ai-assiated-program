Feature: DS-2 Edit existing program details

# Happy paths

Scenario: Open program for editing
  Given I am on the Programs page
  And a program "Web Development 2026" exists
  When I click the edit icon on "Web Development 2026"
  Then I see the edit form pre-populated with the program's current data

Scenario: Successfully edit a program name
  Given I am editing "Web Development 2026"
  When I change the Name to "Web Development 2026 - Updated"
  And I click Save
  Then the modal closes
  And the program list immediately shows "Web Development 2026 - Updated"

Scenario: Edit preserves unchanged fields
  Given I am editing a program
  When I only change the Description
  And I click Save
  Then the Name and other fields remain unchanged

Scenario: Edited details persist after page refresh
  Given I saved an edit renaming a program
  When I refresh the Programs page
  Then the list still shows the updated program name

# Negative

Scenario: Save disabled when Program Name is empty or whitespace only
  Given I am editing an existing program
  When I clear the Program Name field
  Then the Save button is disabled

Scenario: Cancel discards unsaved edits
  Given I am editing a program
  When I change the Name but cancel without saving
  Then the Programs list still shows the original program name

Scenario: Unauthenticated user cannot access Programs
  Given I have no active session
  When I navigate to the Programs page
  Then I am redirected to login

# Edge cases

Scenario: Unicode characters in renamed program render correctly
  Given I am editing a program
  When I change the Name to "Programme 🎓 – データ 2027"
  And I click Save
  Then the Programs list shows "Programme 🎓 – データ 2027"

Scenario: Rapid double-click Save does not create duplicate listings
  Given I am editing a program with pending changes
  When I double-click Save quickly
  Then exactly one program row exists for that program

# Ambiguities and gaps
# - AC references "edit icon" without specifying accessible name or mobile layout.
# - Cancel/Escape/backdrop dismissal paths are unspecified.
# - Duplicate name collision on rename is not in AC (known demo allows duplicates; TC-009 skipped).
# - Non-admin RBAC requires alternate credentials (DIDAXIS_ALT_EMAIL) for full coverage.
# - Concurrent edit conflict strategy is unspecified.
