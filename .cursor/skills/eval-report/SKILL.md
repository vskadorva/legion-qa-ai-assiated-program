---
name: eval-report
description: >-
  Refreshes eval-report.md — flake rate, heal success, generation-gate pass
  rate, ask-vs-guess — from CI logs, PR history, and session review. Use when
  the orchestrator closes a session, after a heal chain, at the end of backlog
  mode, when the user asks for suite reliability, or when eval-report.md is
  stale (>14 days). Cursor has no built-in telemetry; this skill defines how
  to measure each metric manually.
---

# Eval Report — Suite Reliability

Format + measurement procedure. Update `eval-report.md` at repo root; do not
invent numbers — measure or mark **insufficient data**.

## When (mandatory for orchestrator)

The QA orchestrator **must** run this skill before claiming **Done** when any
of the following occurred in the session:

- A heal PR was opened or a red CI run was triaged
- A generation PR was opened for a ticket
- `eval-report.md` is missing or older than **14 days**

Otherwise: skip with a one-line note in the session summary (`eval: skipped —
no trigger`).

## Inputs

| Source | Tool |
| --- | --- |
| CI runs | `gh run list --workflow=playwright.yml --limit 30` + `gh run view <id> --log` |
| PR / heal history | `gh pr list --state all` + `gh pr checks` + `gh pr diff` |
| Ask vs guess | Manual review of recent `agent-transcripts/*.jsonl` + PR bodies |

Default window: **N = 30** most recent `playwright.yml` runs.

## Procedure

1. Pull CI + PR data for the window.
2. Compute the four metrics below (show numerator/denominator).
3. Overwrite `eval-report.md` using the template in this repo (keep section
   order; update **Generated** date and **Window**).
4. End with **top reliability risk** and **next action** — human judgment
   allowed here; metrics above must be evidence-based.

## Metrics

### 1. Flake rate

Tests that passed **only on retry** / total tests in passing runs.

- Scan green-run logs for `retry #`, `passed on retry`, `flaky`
- `playwright.config.ts` sets `retries: 2` in CI
- **What it tells us:** one line — retries hiding timing bugs vs hard failures

### 2. Heal success rate

Drift heals that proved **green on first PR CI** with **assertions unchanged**
/ total locator heal PRs (`heal/*` or “Heal:” title).

- `gh pr diff` — count **masked-regression** = `expect()` removed/weakened (**must be 0**)
- **What it tells us:** one line on one-shot heal vs cascade

### 3. Generation-gate pass rate

Ticket **first** agent PRs where spec is **CI green** + **conforming** (POM
rules) + **maps to AC** / total ticket-first generation PRs.

- Counterexamples (e.g. “static review only”, red first CI) go in the table
- **What it tells us:** one line on first-time generation vs follow-up drift

### 4. Ask vs guess

Explicit asks for human input vs invented values (locators, credentials, AC)
without MCP re-discovery or `npx playwright test`.

- Qualitative ratio is OK — state **how measured** (transcript + PR review)
- **What it tells us:** one line on agent discipline

## Output

Single file: **`eval-report.md`** (repo root, committed).

Do **not** file Jira tickets or change tests in this skill — report only.

## Rules

- Every metric: **number**, **how measured**, **one-line interpretation**
- If data is missing, write `insufficient data` — do not guess
- Cleanup 404s in CI logs are noise, not flakes
