Feature: DS-1 Create new academic program

# Happy paths

Scenario: Navigate to program creation form
  Given I am logged in as admin
  When I navigate to the Programs page
  And I click "+ New Program"
  Then I see the program creation form with fields: Program Name, Description

Scenario: Successfully create a program
  Given I am on the program creation form
  When I fill in Program Name with "Web Development 2026"
  And I fill in Description with "Full-stack web development program"
  And I click Create
  Then the modal closes
  And the program list shows "Web Development 2026"

Scenario: Cancel closes modal without creating a program
  Given I am on the program creation form with draft values entered
  When I click Cancel
  Then the modal closes
  And the program list does not show the draft program name

# Negative

Scenario: Validation prevents empty program name
  Given I am on the program creation form
  When I leave the Program Name field empty
  Then the Create button is disabled

Scenario: Create does not persist when modal is dismissed via Cancel
  Given a draft program name was entered but not submitted
  When I cancel the New Program modal
  Then no new row appears in the Programs list for that draft name

# Edge cases

Scenario: Reopening New Program after cancel shows a fresh empty form
  Given I previously cancelled a draft program name in the New Program modal
  When I open "+ New Program" again
  Then the Program Name field is empty
  And the Create button is disabled

# Ambiguities and gaps
# - AC does not specify cancel/dismiss behavior; covered as negative flow.
# - Duplicate name prevention is not in DS-1 AC (see DS-3).
# - Success toast/snackbar feedback is not mandated in AC.
# - Whitespace-only Program Name handling inherits DS-3 validation rules.
