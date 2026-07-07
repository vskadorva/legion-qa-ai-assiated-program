# Legion QA — Playwright

End-to-end tests for Didaxis Studio, with Cursor agents and skills for ticket-driven test generation.

## Prerequisites

- Node.js 20+
- npm

## Install

```bash
git clone <repo-url>
cd legion-qa-ai-assiated-program
npm ci
npx playwright install --with-deps chromium
```

## Environment

Copy the example file and fill in your values (never commit `.env`):

```bash
cp .env.example .env
```

See `.env.example` for placeholder values and a comment per variable. For local test runs you only need the **Run tests** section:

| Variable | Purpose |
| --- | --- |
| `DIDAXIS_URL` | Playwright `baseURL` |
| `DIDAXIS_EMAIL` / `DIDAXIS_PASSWORD` | Login in `auth.setup` → `storageState` |
| `DIDAXIS_API_TOKEN` | API cleanup and setup/teardown |
| `DIDAXIS_ALT_EMAIL` / `DIDAXIS_ALT_PASSWORD` | Optional — permission probes skip when unset |

The **Agent / CI setup** section (`CURSOR_API_KEY`, `ATLASSIAN_*`) is for the headless agent workflow and Atlassian MCP — not required to run tests locally.

## Run tests

Full suite (auth setup runs first for `ds*.spec.ts`):

```bash
npx playwright test
```

Didaxis ticket specs only:

```bash
npx playwright test --project=didaxis
```

Tagged slices by importance (exactly one tag per `test()`):

```bash
npm run test:smoke        # critical path
npm run test:sanity       # broader happy path
npm run test:regression   # edge cases & depth
npm run test:api          # API / mocked routes
npm run test:e2e          # full UI journeys
npm run test:destructive  # shared-state mutators (serial, --workers=1)
```

### CI triggers (`.github/workflows/playwright.yml`)

| Event | Slice | Command |
| --- | --- | --- |
| `push` | `@sanity` | `npm run test:sanity` |
| `pull_request` | `@smoke` | `npm run test:smoke` |
| `workflow_dispatch` | Full suite (all tests) | `npx playwright test` |

Run the full regression suite on demand: **Actions → Playwright Tests → Run workflow**.

Single file:

```bash
npx playwright test tests/ds3-program-name-validation.spec.ts
```

Open the HTML report after a run:

```bash
npx playwright show-report
```

## Cursor agents & skills

Project rules, agents, and skills live under `.cursor/`:

| Path | Role |
| --- | --- |
| `.cursor/rules/constitution.mdc` | Always-on MUST / SHOULD / WON'T |
| `.cursor/rules/playwright-conventions.mdc` | Locators, POM, auth, assertions |
| `.cursor/rules/qa-orchestrator.mdc` | Ticket / CI workflow coordinator |
| `.cursor/skills/` | Domain skills (`pom-conventions`, `api-cleanup`, `self-heal`, Jira tools, …) |
| `.cursor/agents/` | `test-writer`, `triage`, `bug-reporter` |
| `.cursor/hooks/` | Blocks constitution violations on `Write` to `tests/` and `pages/` |

**MCP in Cursor settings** (not in `.env` for local IDE use): configure Atlassian and GitHub MCP servers with your tokens so agents can read Jira tickets and CI runs. CI uses repo secrets — see `.github/workflows/test-generation.yml`.

Typical flow: give the orchestrator a Jira key (`DS-3`) or a failed run id → it analyzes the ticket, delegates to `test-writer`, runs the spec, and routes red builds through `triage` → `self-heal` or `bug-reporter`. Sessions that heal or generate refresh [`eval-report.md`](eval-report.md) via the `eval-report` skill before **Done**.
