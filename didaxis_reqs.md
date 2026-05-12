Write Playwright tests for creating a new program on Didaxis Studio.

## App context (from manual inspection)
- Login page: https://test.didaxis.studio/login
  - Email field: placeholder="you@college.edu"
  - Password field: placeholder="Your password"
  - Sign In button: getByRole('button', { name: 'Sign In' })
- Programs page: /programs
  - "New Program" button: getByRole('button', { name: '+ New Program' })
  - Modal form:
    - Program Name: placeholder="e.g. Computer Science BSc"
    - Description: placeholder="Brief description"
    - Create button: getByRole('button', { name: 'Create' })

## Credentials
Use dotenv. Read email and password from process.env:
- process.env.DIDAXIS_EMAIL
- process.env.DIDAXIS_PASSWORD
Do NOT hardcode credentials in the test file.

## Test plan
TC-001 — Navigate to program creation form

Preconditions: User is logged in as admin; Programs page is accessible.

Steps:

Navigate to the Programs page.

Click the "+ New Program" button.

Expected Result: A program creation form (modal) appears containing the fields: Program Name, Description, and a Create button.

## Requirements
- TypeScript
- Use Playwright locators (getByRole, getByLabel, getByText)
- Login as the first step in each test (or use beforeEach)
- Each test is independent
- Use unique test data with Date.now() suffix
- Save as tests/ds1-create-program.spec.ts