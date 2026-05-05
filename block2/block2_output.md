# Test Plan: Create New Academic Program

## Feature Overview
This test plan covers the "Create New Academic Program" feature, which allows admin users to create academic programs via a modal form containing Program Name and Description fields.

---

## Positive Flows

### TC-001 — Navigate to program creation form

**Preconditions:** User is logged in as admin; Programs page is accessible.

**Steps:**
1. Navigate to the Programs page.
2. Click the "+ New Program" button.

**Expected Result:** A program creation form (modal) appears containing the fields: Program Name, Description, and a Create button.

**Priority:** High

---

### TC-002 — Successfully create a program with valid data

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Fill in Program Name with "Web Development 2026".
2. Fill in Description with "Full-stack web development program".
3. Click the Create button.

**Expected Result:** The modal closes. The program list displays "Web Development 2026" in the list of programs.

**Priority:** High

---

### TC-003 — Create button is enabled when Program Name is filled

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Type "Data Science 2026" in the Program Name field.
2. Observe the Create button state.

**Expected Result:** The Create button becomes enabled (clickable).

**Priority:** High

---

### TC-004 — Successfully create a program with only Program Name (no Description)

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Fill in Program Name with "Cybersecurity Fundamentals".
2. Leave Description empty.
3. Click the Create button.

**Expected Result:** The program is created successfully. The modal closes and "Cybersecurity Fundamentals" appears in the program list.

**Priority:** Medium

---

### TC-005 — Newly created program persists after page refresh

**Preconditions:** User has just created a program "Web Development 2026" successfully.

**Steps:**
1. Refresh the Programs page (F5 or browser reload).
2. Observe the program list.

**Expected Result:** "Web Development 2026" is still present in the program list.

**Priority:** High

---

### TC-006 — Form fields are empty when modal is first opened

**Preconditions:** User is logged in as admin; on the Programs page.

**Steps:**
1. Click "+ New Program".
2. Observe the Program Name and Description fields.

**Expected Result:** Both fields are empty/blank with no pre-filled values.

**Priority:** Medium

---

## Negative Flows

### TC-007 — Create button is disabled when Program Name is empty

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Leave the Program Name field empty.
2. Optionally fill in Description with "Some description".
3. Observe the Create button.

**Expected Result:** The Create button is disabled and cannot be clicked.

**Priority:** High

---

### TC-008 — Create button is disabled when Program Name contains only whitespace

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Enter "   " (three spaces) in the Program Name field.
2. Observe the Create button.

**Expected Result:** The Create button remains disabled (whitespace-only input is not treated as valid).

**Priority:** Medium

---

### TC-009 — Cannot create a program with a duplicate name

**Preconditions:** A program named "Web Development 2026" already exists in the system.

**Steps:**
1. Open the program creation form.
2. Fill in Program Name with "Web Development 2026".
3. Fill in Description with "Another description".
4. Click Create.

**Expected Result:** An error message is displayed indicating a program with that name already exists. The program is not created, and the modal remains open.

**Priority:** High

---

### TC-010 — Non-admin users cannot access the creation form

**Preconditions:** User is logged in with a non-admin role (e.g., instructor, student).

**Steps:**
1. Navigate to the Programs page.
2. Look for the "+ New Program" button.

**Expected Result:** The "+ New Program" button is either not visible or clicking it returns an authorization error.

**Priority:** High

---

### TC-011 — Unauthenticated user cannot access Programs page

**Preconditions:** User is not logged in.

**Steps:**
1. Attempt to navigate directly to the Programs page URL.

**Expected Result:** User is redirected to the login page or receives a 401/403 error.

**Priority:** High

---

### TC-012 — Clearing Program Name after typing disables Create button

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Type "Temporary Name" in Program Name.
2. Observe that the Create button becomes enabled.
3. Clear the Program Name field completely.
4. Observe the Create button.

**Expected Result:** The Create button becomes disabled again.

**Priority:** Medium

---

## Edge Cases

### TC-013 — Program Name with maximum length input

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Enter a 255-character string in Program Name (e.g., "A" repeated 255 times).
2. Click Create.

**Expected Result:** Either the program is created successfully with the full 255-character name, or the field enforces a max-length and truncates/prevents further input with a visible indicator.

**Priority:** Medium

---

### TC-014 — Program Name exceeding maximum length

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Attempt to enter a 256+ character string in Program Name.
2. Observe field behavior.

**Expected Result:** The field either prevents input beyond the maximum length or displays a validation error message. The Create button should not allow submission of invalid data.

**Priority:** Medium

---

### TC-015 — Program Name with special characters

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Enter `Web Dev <script>alert('xss')</script> 2026` in Program Name.
2. Click Create.

**Expected Result:** Either the input is sanitized and the program is created safely (no script execution), or the form rejects the input with a validation error. No XSS vulnerability is triggered.

**Priority:** High

---

### TC-016 — Program Name with Unicode and emoji characters

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Enter "Développement Web 2026 — 日本語プログラム 🎓" in Program Name.
2. Click Create.

**Expected Result:** The program is created successfully and displays correctly with all Unicode characters preserved in the program list.

**Priority:** Low

---

### TC-017 — Description field with very long text

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Fill in Program Name with "Long Desc Test".
2. Enter a 2000-character description in the Description field.
3. Click Create.

**Expected Result:** The program is created successfully, or the field enforces a visible maximum length with appropriate feedback.

**Priority:** Low

---

### TC-018 — Program Name with leading and trailing whitespace

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Enter "  Web Development 2026  " (with leading/trailing spaces) in Program Name.
2. Click Create.

**Expected Result:** The program is created with the name trimmed to "Web Development 2026" (no leading/trailing whitespace stored).

**Priority:** Medium

---

### TC-019 — Closing the modal without saving discards input

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Enter "Draft Program" in Program Name.
2. Enter "Draft description" in Description.
3. Close the modal (click X, press Escape, or click outside).
4. Reopen the modal by clicking "+ New Program".

**Expected Result:** The modal closes without creating a program. When reopened, all fields are empty again. "Draft Program" does not appear in the program list.

**Priority:** Medium

---

### TC-020 — Rapid double-click on Create button

**Preconditions:** User is logged in as admin; program creation form is filled with valid data.

**Steps:**
1. Fill in Program Name with "Double Click Test".
2. Rapidly double-click the Create button.

**Expected Result:** Only one program is created. No duplicate entry appears in the program list.

**Priority:** Medium

---

### TC-021 — Program Name with single character

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Enter "X" in Program Name.
2. Click Create.

**Expected Result:** The program is either created successfully (if single-character names are allowed) or a minimum-length validation error is shown.

**Priority:** Low

---

### TC-022 — SQL injection attempt in Program Name

**Preconditions:** User is logged in as admin; program creation form is open.

**Steps:**
1. Enter `'; DROP TABLE programs; --` in Program Name.
2. Click Create.

**Expected Result:** The input is handled safely. Either the program is created with the literal string as its name, or validation rejects the input. No database error or data loss occurs.

**Priority:** High

---

### TC-023 — Network failure during program creation

**Preconditions:** User is logged in as admin; form is filled with valid data; network is interrupted (simulated via DevTools or proxy).

**Steps:**
1. Fill in Program Name with "Network Test Program".
2. Disable network connectivity.
3. Click Create.

**Expected Result:** A user-friendly error message is displayed (e.g., "Unable to save. Please check your connection and try again."). The modal remains open with data intact so the user can retry.

**Priority:** Medium

---

### TC-024 — Concurrent creation of same program name by two admins

**Preconditions:** Two admin users have the program creation form open simultaneously.

**Steps:**
1. Admin A enters "Concurrent Program" and clicks Create.
2. Admin B enters "Concurrent Program" and clicks Create (shortly after Admin A).

**Expected Result:** Admin A's program is created successfully. Admin B receives a duplicate name error and is not allowed to create a second program with the same name.

**Priority:** Low

---

## Ambiguities and Gaps in Acceptance Criteria

| # | Issue | Question / Concern |
|---|-------|--------------------|
| 1 | **Description field requirement** | Is the Description field optional or required? The ACs never test submitting without a description, implying it's optional, but this is not stated explicitly. |
| 2 | **Maximum field lengths** | No maximum character limits are specified for Program Name or Description. What are the storage/display limits? |
| 3 | **Minimum field lengths** | Is a single-character Program Name valid? Is there a minimum length requirement? |
| 4 | **Duplicate name handling** | The ACs do not specify what happens when a user attempts to create a program with a name that already exists. Should uniqueness be enforced? |
| 5 | **Whitespace handling** | Should leading/trailing whitespace be trimmed from Program Name? Should whitespace-only input be treated as empty? |
| 6 | **Modal dismissal behavior** | How is the modal closed without saving? (X button, Escape key, clicking backdrop?) What happens to unsaved data? |
| 7 | **Form type not specified** | Is this a modal dialog or a separate page? The AC says "modal closes" but the navigation AC doesn't mention a modal opening. |
| 8 | **Success feedback** | Beyond the program appearing in the list, is there a toast/notification confirming successful creation? |
| 9 | **Program list ordering** | Where does the newly created program appear in the list — top, bottom, or alphabetically sorted? |
| 10 | **Authorization** | Only "admin" is mentioned. Are there other roles that should or should not have access? |
| 11 | **Create button disabled state vs. validation message** | The AC says the button is disabled when the name is empty, but it doesn't specify whether an inline validation message or tooltip explains why. |
| 12 | **Character restrictions** | Are there any forbidden characters in Program Name (e.g., `<`, `>`, `/`, `\`)? |
| 13 | **Double-submit prevention** | No mention of preventing multiple rapid submissions of the same form. |
