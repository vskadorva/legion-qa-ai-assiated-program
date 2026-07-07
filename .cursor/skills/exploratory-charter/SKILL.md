---
name: exploratory-charter
description: >-
  Turns a feature name and a risk into a session charter and a blank findings
  template. Use when the user asks for an exploratory charter, session charter,
  exploratory testing plan, or wants to structure a time-boxed exploration
  before or after clicking through the app. The tester supplies the thinking;
  this skill only enforces the format.
---

# Exploratory Charter

Format-only. Do **not** invent risks, oracles, or findings — ask the human or
use what they already gave you.

## Inputs (required)

| Input | Example |
| --- | --- |
| **Feature** | Program semester selection |
| **Risk** | Wrong program context shown after switching selection |

Optional: time box (minutes), scope in/out, ticket key, page URL.

## Procedure

1. Confirm **feature** and **risk** with the user if either is missing.
2. Fill the **Charter** template below — leave `[brackets]` only where the
   human has not supplied content yet; do not fabricate probes or oracles.
3. Append the **Findings** template (empty rows) on the same file.
4. Save as `charters/<feature-slug>.md` (slug: lowercase, hyphens, no spaces).

## Charter template

```markdown
# Charter — [Feature]

| Field | Value |
| --- | --- |
| Feature | [feature] |
| Risk | [risk] |
| Time box | [e.g. 45 min] |
| In scope | [pages, roles, flows] |
| Out of scope | [explicit exclusions] |
| Ticket | [DS-NN or —] |

## Mission

Explore **[feature]** with **[risk]** as the primary concern.

## Oracles

What would signal a problem? (human — do not invent)

- [oracle 1]
- [oracle 2]

## Areas to probe

Where might the risk show up? (human — do not invent)

- [area 1]
- [area 2]

## Notes before start

[assumptions, data needed, env, blockers]
```

## Findings template

Append after the charter:

```markdown
---

# Findings — [Feature]

| # | Type | Area | Observation | Severity | Follow-up |
| --- | --- | --- | --- | --- | --- |
| 1 | bug / question / note | | | | |
| 2 | | | | | |

## Coverage

- **Tried:** [flows, states, roles visited]
- **Not tried:** [deferred for next session]
- **Charter done?** yes / no — [reason if no]
```

**Type:** `bug` (defect), `question` (needs PO/dev answer), `note` (risk lowered, no action).

## Rules

- Thinking is human; you fill headings and tables only.
- Empty findings rows are fine at charter time.
- Do not write Playwright specs, file Jira bugs, or run tests in this skill.
- After exploration, the human (or a follow-up task) updates the findings table.
