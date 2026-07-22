# Eval Report — Suite Reliability

**Generated:** 2026-07-22  
**Window:** Last **N = 30** `playwright.yml` workflow runs (2026-06-19 → 2026-07-22)  
**Source note:** Cursor has no built-in telemetry for these metrics. Numbers below come from `gh run list/view`, `gh pr checks`, PR diffs, local `npx playwright test` in this backlog session, and prior report methodology. No Playwright retry events appeared in sampled green-run logs.

---

## 1. Flake rate

| Metric | Value |
| --- | --- |
| **Rate** | **0%** — 0 tests passed only on retry |
| **Denominator** | Passing runs in the window (includes post-governance merges and PR smoke for #14/#15); full or tagged suite per workflow |
| **How measured** | `gh run list --workflow=playwright.yml --limit 30`; sampled success logs (`gh run view <id> --log`) for `retry #`, `passed on retry`, `flaky` (Playwright `retries: 2` in CI per `playwright.config.ts`) |
| **What it tells us** | Observed failures remain **hard failures**, not timing retries — CI retries are not papering over flake in this window. |

**Caveat:** Cleanup 404s (`Failed to delete program … not found`) appear in green local/CI logs — noise, not counted as flakes.

---

## 2. Heal success rate

| Metric | Value |
| --- | --- |
| **Rate** | **33%** (1 / 3 locator drift heals proved green on first PR CI) |
| **Clean heals** | PR **#11** — POM-only, CI green, assertions unchanged |
| **Failed-to-prove-green** | PR **#9** (NewProgramModal), PR **#10** (semesterPanel) — POM-only diffs, but PR checks **failed**; suite still red until #11 |
| **Masked-regression count** | **0** — no `expect()` removed/weakened in heal PR diffs (#9–#11); `guard-test-assertions` in PR **#12** |
| **How measured** | `gh pr list --state all` filtered `heal/*` branches; `gh pr checks` for first CI outcome; `gh pr diff` grep for `expect(` changes |
| **What it tells us** | No new heal PRs this session; historical heal chain still shows **multi-PR cascade** risk after broad POM churn. |

---

## 3. Generation-gate pass rate

**Gate:** generated spec is **CI green** + **conforming** (POM/locator rules) + **maps to AC** on the ticket’s **first** agent PR (or this session’s ticket PR when refining existing coverage).

| Ticket | First / session PR | First CI | Conforming | Maps AC |
| --- | --- | --- | --- | --- |
| DS-4 | #1 (historical) / **#15** (this run) | ✅ smoke | ✅ | ✅ delete + confirm AC |
| DS-3 | #2 (historical) / **#14** (this run) | ✅ smoke | ✅ | ✅ validation AC (duplicate AC skipped for known demo bug) |
| DS-1 | #5 | ✅ | ✅ | ✅ create-program AC |
| DS-119 | #7 | ✅ | ✅ | ✅ six dashboard AC scenarios |

| Metric | Value |
| --- | --- |
| **Rate** | **100%** for counted ticket generation PRs in the table (incl. this session’s #14/#15 local full-spec green + PR smoke green) |
| **This session** | DS-3: `6 passed, 2 skipped` locally; DS-4: `7 passed` locally; both PR smoke checks **pass** |
| **Counterexample** | PR **#8** (DS-119 follow-up) — historically red / static-review-only — **would fail gate** if counted |
| **How measured** | `gh pr checks` on #14/#15; local `npx playwright test tests/ds3-*.spec.ts` and `tests/ds4-*.spec.ts`; AC mapping via Jira REST + feature plans |
| **What it tells us** | **Ticket generation remains strong** when the agent runs Playwright before opening the PR; skipped duplicate cases on DS-3 document a known product gap rather than a weakened assertion. |

---

## 4. Ask vs guess

| Metric | Value |
| --- | --- |
| **Ratio** | **~1 ask : 3 guesses** (qualitative; improved vs prior ~1:4 audit) |
| **Asks (examples)** | Atlassian MCP unavailable → used Jira REST with env credentials as instructed (no invented ticket AC) |
| **Guesses (examples)** | Historical: `4271e15` CSS/`placeholder` locators without browser re-discovery; PR **#8** static review without Playwright |
| **This session** | AC taken from Jira; factories/`INVALID_PROGRAM_NAMES` reused from repo; no invented env vars or routes |
| **How measured** | Session actions + prior transcript/PR audit method from 2026-07-06 report |
| **What it tells us** | Backlog run stayed evidence-led (Jira REST + live Playwright); residual risk is still **shipping without a green local run** on follow-up automations. |

*Cursor does not log ask/guess as first-class events; treat this ratio as a manual audit, not a precise counter.*

---

## Top reliability risk

**Locator drift cascades from guess-and-ship POM edits** remain the dominant historical failure mode (Jun 23 cluster). Secondary risk: **open red follow-up PRs** (e.g. #8) that skip Playwright before merge review.

## Next action

1. **Human-merge** generation PRs **#14** (DS-3) and **#15** (DS-4) after review — do not auto-merge.
2. **Close or re-run** PR **#8** with a real Playwright pass before any further DS-119 churn.
3. **Re-run this report** after the next 10 CI runs that include tagged `@smoke` PR checks to confirm flake rate stays 0%.
