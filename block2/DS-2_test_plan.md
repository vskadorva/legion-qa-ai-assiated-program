# Test Plan: Edit Existing Program Details

## Feature Overview
This test plan covers the **Edit existing program details** capability ([DS-2](https://legionqaschool.atlassian.net/browse/DS-2)) for Didaxis Studio. An admin opens an existing program from the Programs list, updates its fields in an edit UI (implicitly a modal in the acceptance criteria via “modal closes”), saves, and verifies the Programs list reflects the changes.

---

## Positive Flows

### TC-001 — Open program for editing via edit icon

**Preconditions:** User is logged in as admin; Programs page is accessible; a program named "Web Development 2026" exists in the list.

**Steps:**
1. Navigate to the Programs page.
2. Locate the row for "Web Development 2026".
3. Click the edit icon (or equivalent control) for that program.

**Expected Result:** The edit form opens and is **pre-populated** with the program's current Name and Description (matching what is stored for "Web Development 2026"). A Save action control is present.

**Priority:** High

---

### TC-002 — Successfully update program Name and reflect in list immediately

**Preconditions:** User is logged in as admin; Programs page lists "Web Development 2026"; user has opened edit for that program.

**Steps:**
1. Change the Program Name field to "Web Development 2026 - Updated".
2. Click Save.

**Expected Result:** The modal (or edit container) closes. The Programs list **immediately** shows **"Web Development 2026 - Updated"** and **no longer** lists the old exact name unless the UI deduplicates/aliases unexpectedly (expect replacement of the renamed program entry).

**Priority:** High

---

### TC-003 — Updating only Description preserves Name and other unchanged fields

**Preconditions:** User is logged in as admin; editing a program that has Name "Applied AI 2026" and Description "Original description".

**Steps:**
1. Open edit for that program.
2. Change only the Description field to "Updated description focused on NLP".
3. Do not modify the Program Name field.
4. Click Save.

**Expected Result:** After save, the program still appears with Name **"Applied AI 2026"** (unchanged). Description reflects **"Updated description focused on NLP"** when the program is reopened for edit or wherever description is surfaced in UI.

**Priority:** High

---

### TC-004 — Successfully update Program Name while leaving Description unchanged

**Preconditions:** User is logged in as admin; a program exists with Name "Course Catalog Pilot" and a non-empty Description.

**Steps:**
1. Open edit for "Course Catalog Pilot".
2. Change Name to "Course Catalog Pilot - Revised".
3. Leave Description unchanged.
4. Click Save.

**Expected Result:** List shows **"Course Catalog Pilot - Revised"**. Reopening edit shows Description identical to what it was before the save.

**Priority:** Medium

---

### TC-005 — Edited program details persist after page refresh

**Preconditions:** User saved an edit renaming a program from "Staging Program Alpha" to "Staging Program Beta".

**Steps:**
1. While on the Programs page, refresh the browser (e.g., F5 / reload).

**Expected Result:** The list still shows **"Staging Program Beta"** with the expected Description consistent with last save.

**Priority:** High

---

### TC-006 — Edit form reflects latest saved values when reopened

**Preconditions:** User edited and saved Description for "Labs Program" twice in succession (second save intentional).

**Steps:**
1. Open edit on "Labs Program" again.

**Expected Result:** Fields reflect the **latest** persisted values after the second save — not stale or cached values from the first edit session only.

**Priority:** Medium

---

## Negative Flows

### TC-007 — Save is disabled when Program Name would be invalid (empty / whitespace-only)

**Preconditions:** User is logged in as admin; edit form open for an existing program.

**Steps:**
1. Clear the Program Name field entirely (and optionally observe with Description filled).
2. Optionally repeat with whitespace-only (`   `) in Program Name.

**Expected Result:** Save is **disabled**, or pressing Save triggers validation and **does not persist** destructive empty/whitespace-only names — consistent with product rules for DS-1 if shared validation applies.

**Priority:** High

---

### TC-008 — Discard or cancel restores list without phantom updates

**Preconditions:** User is editing program "Rollback Test"; current Name on server is "Rollback Test".

**Steps:**
1. Change Name to "Should Not Persist".
2. Close the modal without saving (explicit Cancel, Escape, backdrop click per product behavior — whichever is implemented).
3. Observe Programs list without refresh.

**Expected Result:** Name remains **"Rollback Test"**. No partial update persisted.

**Priority:** High

---

### TC-009 — Renaming conflicts with existing program Name is rejected

**Preconditions:** Two programs exist: **"Physics 101"** and **"Chemistry Basics"**.

**Steps:**
1. Open edit on **"Chemistry Basics"**.
2. Change Name to **"Physics 101"**.
3. Click Save.

**Expected Result:** Appropriate error messaging; save does not silently overwrite; **"Chemistry Basics"** retains its distinct identity until user picks a unique name — if duplicate names are forbidden (align with DS create rules).

**Priority:** High

---

### TC-010 — Non-admin cannot edit programs

**Preconditions:** User is logged in with a non-privileged role allowed to reach Programs UI if applicable — or forbidden entirely.

**Steps:**
1. Navigate to Programs.
2. Attempt to locate and use edit for any program row.

**Expected Result:** Edit is **hidden**, disabled, or results in authorization error consistent with RBAC expectations for Didaxis Studio.

**Priority:** High

---

### TC-011 — Unauthenticated user cannot trigger edit flow

**Preconditions:** No active authenticated session.

**Steps:**
1. Attempt to open Programs route / deep link edit URL if exposed.

**Expected Result:** Redirect to login / 401/403; editing not possible without auth.

**Priority:** High

---

### TC-012 — Clearing Name after typing re-disables Save (if applicable)

**Preconditions:** User has edit modal open.

**Steps:**
1. Type a temporary valid Name ("Temp Name") and observe Save state.
2. Clear Name fully again.

**Expected Result:** Save disabled or prevented after validation, symmetric with DS-1 create behavior if validations are reused.

**Priority:** Medium

---

## Edge Cases

### TC-013 — Leading and trailing spaces in edited Name handled consistently

**Preconditions:** User edits program " Trim Test Program " (or creates one with trimming rules from DS-1 if applicable).

**Steps:**
1. Open edit for a program whose canonical name does not rely on stray spaces for uniqueness.
2. Enter Name `  Honors Bio 2026  ` including leading/trailing spaces.
3. Save.

**Expected Result:** Stored/displayed behavior matches DS-1 / product trimming rules — either trimmed cleanly on save or field validation blocks ambiguous names.

**Priority:** Medium

---

### TC-014 — Unicode and emoji preservation in renamed program

**Preconditions:** User opens edit.

**Steps:**
1. Change Name to "Programme 🎓 – データ 2027".
2. Save.

**Expected Result:** Characters render correctly post-save in Programs list and in subsequent edit preload.

**Priority:** Low

---

### TC-015 — Rapid double-submit on Save

**Preconditions:** Edit form loaded with legitimate changes ready to save.

**Steps:**
1. Double-click Save quickly.

**Expected Result:** Exactly one logical save; program list reflects one consistent final state — no duplicated rows or flicker inconsistencies.

**Priority:** Medium

---

### TC-016 — Concurrent edits by two admin sessions last-write-wins or conflict surfaced

**Preconditions:** Two browser sessions authenticated as admins.

**Steps:**
1. Both open edit for the same program.
2. Admin A edits Description → Save.
3. Admin B edits Name (possibly stale preload) → Save immediately after without refresh.

**Expected Result:** Conflict strategy is explicit — either stale edit blocked with message, or last save wins consistently with surfaced warning; data does not silently corrupt unrelated fields unexpectedly.

**Priority:** Low

---

### TC-017 — Extended Description change does not truncate unexpectedly

**Preconditions:** User edits Description only.

**Steps:**
1. Paste a lengthy Description (~2000 characters) respecting any client max if known.
2. Save.

**Expected Result:** Program reloads displaying full allowable Description or emits clear **max-length** validation before truncation without silent data loss.

**Priority:** Low

---

### TC-018 — XSS / HTML-injection sanitization unchanged from create behavior

**Preconditions:** User edits Description or Name containing `<script>...</script>` or angle-bracket payloads.

**Steps:**
1. Save.

**Expected Result:** Input stored/rendered safely; no executable script injection in Programs list/edit fields.

**Priority:** High

---

### TC-019 — Edit icon discoverability differs at narrow viewport breakpoints

**Preconditions:** Admin on Programs responsive layout.

**Steps:**
1. Resize window to smallest supported width.
2. Attempt to edit a program row.

**Expected Result:** Primary edit affordance remains usable (overflow menu alternate acceptable) — no orphaned inaccessible actions.

**Priority:** Low

---

## Ambiguities and Gaps in Acceptance Criteria

| # | Issue | Question / Concern |
|---|-------|---------------------|
| 1 | **Edit affordance specificity** | The AC references an “edit icon” but not label text, tooltip, alternate menu entries, nor mobile presentation. Confirm canonical locator semantics for automation. |
| 2 | **Cancel / Escape / backdrop** | “Modal closes” on success — but dismissal without save is unspecified. Confirm supported cancel paths & whether partial edits warn the user. |
| 3 | **Save vs Create naming** | Create flow uses Create; Edit uses Save — confirm destructive rename edge cases reuse same validations as DS-1. |
| 4 | **Duplicate Name after edit** | AC does not spell duplicate-name collisions when renaming toward another existing program. |
| 5 | **Field inventory** | Only Name & implicit Description surfaced in preload scenario; clarify if Programs feature other immutable fields surfaced read-only vs absent. |
| 6 | **Immediate list update definition** | “Immediately” lacks timing guidance for async saves / optimistic UI; determine expected behavior if network stalls. |
| 7 | **Success feedback beyond list** | Toasts/snackbars or inline feedback not mandated in AC despite likely UX parity with create. |
| 8 | **Authorization matrix** | States admin-centric behavior only; unspecified role coverage parallels DS-1. |
| 9 | **Whitespace-only Name** | Not covered in DS-2 AC explicitly; inherits ambiguity from DS-1 trimming policy. |
