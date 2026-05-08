# Test Plan — TODO MVC Application

**Application URL:** https://demo.playwright.dev/todomvc/#/  
**Framework:** React • TodoMVC  
**Author:** QA Engineer  
**Date:** 2026-05-07  

---

## Positive Flows

### AC 1: Create a todo list

| Field | Value |
|-------|-------|
| **ID** | TC-001 |
| **Title** | Todo list is created when the first item is added |
| **Preconditions** | Application is loaded, no existing todos |
| **Steps** | 1. Navigate to https://demo.playwright.dev/todomvc/#/ <br> 2. Type "Buy groceries" in the "What needs to be done?" input <br> 3. Press Enter |
| **Expected Result** | A todo list appears with "Buy groceries" as the first item. The footer shows "1 items left" and filter links (All, Active, Completed) become visible. |
| **Priority** | High |

---

### AC 2: Add items (4)

| Field | Value |
|-------|-------|
| **ID** | TC-002 |
| **Title** | Four todo items can be added sequentially |
| **Preconditions** | Application is loaded, no existing todos |
| **Steps** | 1. Type "Buy groceries" in the input field and press Enter <br> 2. Type "Clean the house" in the input field and press Enter <br> 3. Type "Read a book" in the input field and press Enter <br> 4. Type "Go for a walk" in the input field and press Enter |
| **Expected Result** | The todo list displays all 4 items in the order they were added. The footer shows "4 items left". The input field is cleared after each entry. |
| **Priority** | High |

---

| Field | Value |
|-------|-------|
| **ID** | TC-003 |
| **Title** | Input field is cleared after adding a todo |
| **Preconditions** | Application is loaded |
| **Steps** | 1. Type "Buy groceries" in the input field <br> 2. Press Enter |
| **Expected Result** | The input field value is empty after the item is added. Placeholder "What needs to be done?" is visible again. |
| **Priority** | Medium |

---

### AC 3: Finish item — Expect to be finished

| Field | Value |
|-------|-------|
| **ID** | TC-004 |
| **Title** | Clicking the toggle checkbox marks a todo as completed |
| **Preconditions** | A todo list exists with at least one active item ("Buy groceries") |
| **Steps** | 1. Click the toggle checkbox next to "Buy groceries" |
| **Expected Result** | The item displays with a strikethrough style and a green checkmark. The "items left" counter decreases by 1. A "Clear completed" button appears in the footer. |
| **Priority** | High |

---

| Field | Value |
|-------|-------|
| **ID** | TC-005 |
| **Title** | Completed items appear in the "Completed" filter |
| **Preconditions** | A todo list exists with "Buy groceries" marked as completed |
| **Steps** | 1. Click the "Completed" filter link |
| **Expected Result** | Only "Buy groceries" is visible. Active items are hidden. |
| **Priority** | High |

---

| Field | Value |
|-------|-------|
| **ID** | TC-006 |
| **Title** | Completed item can be unchecked to reactivate |
| **Preconditions** | "Buy groceries" is marked as completed |
| **Steps** | 1. Click the toggle checkbox next to "Buy groceries" again |
| **Expected Result** | The strikethrough is removed, the item returns to active state, and the "items left" counter increases by 1. |
| **Priority** | Medium |

---

### AC 4: Remove item from the list — Expect to be removed

| Field | Value |
|-------|-------|
| **ID** | TC-007 |
| **Title** | Hovering over a todo reveals the destroy button |
| **Preconditions** | A todo list exists with at least one item |
| **Steps** | 1. Hover over the "Read a book" list item |
| **Expected Result** | A red "×" (destroy) button appears on the right side of the item. |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-008 |
| **Title** | Clicking the destroy button removes the item from the list |
| **Preconditions** | A todo list has 4 items: "Buy groceries", "Clean the house", "Read a book", "Go for a walk" |
| **Steps** | 1. Hover over "Read a book" <br> 2. Click the "×" (destroy) button |
| **Expected Result** | "Read a book" is removed from the list. The remaining 3 items are displayed. The "items left" counter shows "3 items left". |
| **Priority** | High |

---

| Field | Value |
|-------|-------|
| **ID** | TC-009 |
| **Title** | Removing the last item hides the list and footer |
| **Preconditions** | A todo list has exactly 1 item |
| **Steps** | 1. Hover over the remaining item <br> 2. Click the "×" (destroy) button |
| **Expected Result** | The todo list section and footer are hidden. Only the input field and heading remain. |
| **Priority** | Medium |

---

## Negative Flows

| Field | Value |
|-------|-------|
| **ID** | TC-010 |
| **Title** | Empty input does not create a todo |
| **Preconditions** | Application is loaded |
| **Steps** | 1. Leave the input field empty <br> 2. Press Enter |
| **Expected Result** | No todo item is added. No list or footer appears. |
| **Priority** | High |

---

| Field | Value |
|-------|-------|
| **ID** | TC-011 |
| **Title** | Whitespace-only input does not create a todo |
| **Preconditions** | Application is loaded |
| **Steps** | 1. Type "   " (spaces only) in the input field <br> 2. Press Enter |
| **Expected Result** | No todo item is added. The input field is cleared. |
| **Priority** | High |

---

| Field | Value |
|-------|-------|
| **ID** | TC-012 |
| **Title** | Completed items are not counted in "items left" |
| **Preconditions** | A todo list has 4 active items |
| **Steps** | 1. Mark "Buy groceries" as completed <br> 2. Mark "Clean the house" as completed |
| **Expected Result** | The footer shows "2 items left" (only active items counted). |
| **Priority** | High |

---

| Field | Value |
|-------|-------|
| **ID** | TC-013 |
| **Title** | Active filter does not show completed items |
| **Preconditions** | "Buy groceries" is completed, other items are active |
| **Steps** | 1. Click the "Active" filter link |
| **Expected Result** | "Buy groceries" is NOT visible. Only active items are shown. |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-014 |
| **Title** | Destroy button is not visible without hovering |
| **Preconditions** | A todo list exists with items |
| **Steps** | 1. Observe the todo list without hovering over any item |
| **Expected Result** | No destroy (×) button is visible on any item. |
| **Priority** | Low |

---

## Edge Cases

| Field | Value |
|-------|-------|
| **ID** | TC-015 |
| **Title** | Special characters are preserved in todo text |
| **Preconditions** | Application is loaded |
| **Steps** | 1. Type `<script>alert('xss')</script>` in the input field <br> 2. Press Enter |
| **Expected Result** | The todo is created with the literal text `<script>alert('xss')</script>`. No script is executed. The text is displayed escaped. |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-016 |
| **Title** | Duplicate todo items can be added |
| **Preconditions** | "Buy groceries" already exists in the list |
| **Steps** | 1. Type "Buy groceries" in the input field <br> 2. Press Enter |
| **Expected Result** | A second "Buy groceries" item is added to the list. Both are displayed independently. |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-017 |
| **Title** | Very long todo text is handled gracefully |
| **Preconditions** | Application is loaded |
| **Steps** | 1. Type a 500-character string in the input field <br> 2. Press Enter |
| **Expected Result** | The todo is created and displayed. Text is either shown in full or truncated with an ellipsis. No UI breaking or overflow occurs. |
| **Priority** | Low |

---

| Field | Value |
|-------|-------|
| **ID** | TC-018 |
| **Title** | "Mark all as complete" toggles all items at once |
| **Preconditions** | A todo list has 4 active items |
| **Steps** | 1. Click the "Mark all as complete" toggle (chevron icon) |
| **Expected Result** | All 4 items are marked as completed (strikethrough, green checkmarks). Footer shows "0 items left". "Clear completed" button appears. |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-019 |
| **Title** | "Clear completed" removes all completed items |
| **Preconditions** | 2 items are completed, 2 items are active |
| **Steps** | 1. Click the "Clear completed" button |
| **Expected Result** | Only the 2 active items remain in the list. "Clear completed" button disappears. Counter shows "2 items left". |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-020 |
| **Title** | Double-clicking a todo enables inline editing |
| **Preconditions** | "Buy groceries" exists in the list |
| **Steps** | 1. Double-click on the "Buy groceries" text |
| **Expected Result** | The todo text becomes an editable input field. The user can modify the text. |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-021 |
| **Title** | Editing a todo and pressing Enter saves changes |
| **Preconditions** | "Buy groceries" is in edit mode |
| **Steps** | 1. Clear the text <br> 2. Type "Buy organic groceries" <br> 3. Press Enter |
| **Expected Result** | The todo displays "Buy organic groceries". Edit mode is closed. |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-022 |
| **Title** | Editing a todo and pressing Escape cancels changes |
| **Preconditions** | "Buy groceries" is in edit mode |
| **Steps** | 1. Change the text to "Something else" <br> 2. Press Escape |
| **Expected Result** | The todo still displays "Buy groceries". Edit mode is closed without saving. |
| **Priority** | Low |

---

| Field | Value |
|-------|-------|
| **ID** | TC-023 |
| **Title** | Editing a todo to empty string removes it |
| **Preconditions** | "Buy groceries" is in edit mode |
| **Steps** | 1. Clear all text from the input <br> 2. Press Enter |
| **Expected Result** | The "Buy groceries" item is removed from the list. |
| **Priority** | Low |

---

| Field | Value |
|-------|-------|
| **ID** | TC-024 |
| **Title** | Todo state persists after page refresh |
| **Preconditions** | A todo list exists with 4 items, 1 completed |
| **Steps** | 1. Refresh the browser page |
| **Expected Result** | All 4 items are still present with their correct states (1 completed, 3 active). |
| **Priority** | Medium |

---

| Field | Value |
|-------|-------|
| **ID** | TC-025 |
| **Title** | Leading and trailing whitespace is trimmed from todo text |
| **Preconditions** | Application is loaded |
| **Steps** | 1. Type "   Buy groceries   " (with leading/trailing spaces) in the input field <br> 2. Press Enter |
| **Expected Result** | The todo is created with trimmed text "Buy groceries". |
| **Priority** | Low |

---

## Ambiguities and Gaps in the Acceptance Criteria

1. **Maximum number of items** — The ACs don't specify if there's a limit on how many todos can be added.
2. **Persistence** — The ACs don't mention whether todos should survive a page refresh (localStorage behavior).
3. **Edit functionality** — The app supports double-click to edit, but the ACs don't cover editing existing todos.
4. **"Mark all as complete"** — The app has a toggle-all feature not mentioned in the ACs.
5. **"Clear completed"** — The app has a bulk-clear button not mentioned in the ACs.
6. **Filters (All/Active/Completed)** — The app has filter navigation not mentioned in the ACs.
7. **"Remove item" method** — The ACs say "remove item from the list" but don't specify the mechanism (hover + destroy button vs. clear completed vs. edit to empty).
8. **Order of items** — The ACs don't specify whether items should appear in insertion order.
9. **Item count format** — The ACs don't specify the expected format of the counter (singular "1 item left" vs. plural "2 items left").
