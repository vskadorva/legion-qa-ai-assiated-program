# Eval Report — Suite Reliability

**Generated:** 2026-07-06  
**Window:** Last **N = 30** `playwright.yml` workflow runs (2026-06-09 → 2026-06-23)  
**Source note:** Cursor has no built-in telemetry for these metrics. Numbers below come from `gh run list/view`, `gh pr checks`, PR diffs, and manual review of 12 recent agent session transcripts. No Playwright retry events appeared in downloadable CI stdout; artifact-level HTML reports were not batch-scanned.

---

## 1. Flake rate

| Metric | Value |
| --- | --- |
| **Rate** | **0%** — 0 tests passed only on retry |
| **Denominator** | 17 passing runs (of 30 total); full suite each run (`npx playwright test`) |
| **How measured** | `gh run list --workflow=playwright.yml --limit 30`; for each `conclusion: success` run, `gh run view <id> --log` scanned for `retry #`, `passed on retry`, `flaky` (Playwright `retries: 2` in CI per `playwright.config.ts`) |
| **What it tells us** | Observed failures are **hard failures**, not timing retries — the suite is not buying green with CI retries in this window. |

**Caveat:** Cleanup 404s (`Failed to delete program … not found`) appear in many green logs — noise, not counted as flakes.

---

## 2. Heal success rate

| Metric | Value |
| --- | --- |
| **Rate** | **33%** (1 / 3 locator drift heals proved green on first PR CI) |
| **Clean heals** | PR **#11** — POM-only, CI green, assertions unchanged |
| **Failed-to-prove-green** | PR **#9** (NewProgramModal), PR **#10** (semesterPanel) — POM-only diffs, but PR checks **failed**; suite still red until #11 |
| **Masked-regression count** | **0** — no `expect()` removed/weakened in heal PR diffs (#9–#11); `guard-test-assertions` landed in PR **#12** afterward |
| **How measured** | `gh pr list --state all` filtered `heal/*` branches; `gh pr checks` for first CI outcome; `gh pr diff` grep for `expect(` changes |
| **What it tells us** | Self-heal fixes **one locator at a time** but the **Jun 23 cascade** (commit `4271e15` “update tests and POM”) needed **three PRs** before green — drift healing is not yet one-shot reliable. |

**Incident context:** 13 / 30 CI runs failed in the window; most cluster on 2026-06-23 after role-based locators were swapped for CSS/placeholder selectors.

---

## 3. Generation-gate pass rate

**Gate:** generated spec is **CI green** + **conforming** (POM/locator rules) + **maps to AC** on the ticket’s **first** agent PR.

| Ticket | First PR | First CI | Conforming | Maps AC |
| --- | --- | --- | --- | --- |
| DS-4 | #1 | ✅ | ✅ | ✅ delete + confirm AC |
| DS-3 | #2 | ✅ | ✅ | ✅ validation AC |
| DS-1 | #5 | ✅ | ✅ | ✅ create-program AC |
| DS-119 | #7 | ✅ | ✅ | ✅ six dashboard AC scenarios |

| Metric | Value |
| --- | --- |
| **Rate** | **100%** (4 / 4 ticket-first generation PRs) |
| **Counterexample** | PR **#8** (DS-119 follow-up automation) — CI **red**, body states *“Static review only: Playwright was not run”* — **would fail gate** if counted as a generation PR |
| **How measured** | `gh pr view` for ticket-linked titles, `gh pr checks` on first commit, PR body AC mapping, file paths under `tests/` + `pages/` |
| **What it tells us** | **First-time ticket generation is strong**; **follow-up automations** that skip `npx playwright test` are the weak link (PR #8 still open/red). |

---

## 4. Ask vs guess

| Metric | Value |
| --- | --- |
| **Ratio** | **~1 ask : 4 guesses** (qualitative, last 12 agent sessions + PR history) |
| **Asks (examples)** | 1 explicit blocker ask in transcripts (Atlassian MCP auth required before finishing Jira draft) |
| **Guesses (examples)** | `4271e15` — CSS/`placeholder` locators substituted without browser MCP re-discovery; PR **#8** — convention refactor without running Playwright; PR **#9/#10** — merged while CI still red |
| **How measured** | Manual pass over 12 `agent-transcripts/*.jsonl` for clarifying questions to the user; cross-check against PR bodies/commits for “static review only” and locator changes without `browser_snapshot` evidence |
| **What it tells us** | The agent **ships refactors and heals on inference** more often than it **stops to ask or prove green** — aligns with the Jun 23 failure cluster. |

*Cursor does not log ask/guess as first-class events; treat this ratio as a manual audit, not a precise counter.*

---

## Top reliability risk

**Locator drift cascades amplified by guess-and-ship edits** — one bad POM commit (`4271e15`) broke ~40 tests, required a multi-PR heal chain, and consumed 43% of CI runs in the window (13/30 failures).

## Next action

1. **Block merge on red PR CI** for agent-opened branches (generation and heal).
2. **Require `npx playwright test` (or tagged slice) in every test-writer / self-heal turn** before opening a PR — PR #8 pattern must not repeat.
3. **Re-run this report** after 10 post-hook CI runs with tagged slices (`@smoke` on PR, `@sanity` on push) to confirm flake rate stays 0% under the new workflow.
