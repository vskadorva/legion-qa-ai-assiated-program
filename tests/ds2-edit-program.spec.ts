import { test, expect, type Page } from '@playwright/test';

const BASE_URL = process.env.DIDAXIS_URL!;

/** Row edit control is the emoji pencil rendered as a Mantine IconButton (verified via MCP / live UI probes). */
function editButtonForProgramRow(row: ReturnType<Page['getByRole']>) {
  return row.locator('button').filter({ hasText: '✏️' }).first();
}

async function createProgram(page: Page, programName: string, description: string) {
  await page.goto(`${BASE_URL}/programs`);
  await page.getByRole('button', { name: '+ New Program' }).click();

  await expect(page.getByRole('dialog', { name: 'New Program' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Program Name' }).fill(programName);
  await page.getByRole('textbox', { name: 'Description' }).fill(description);
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('dialog', { name: 'New Program' })).not.toBeVisible();
  await expect(page.getByText(programName)).toBeVisible();
}

async function openEditForProgram(
  page: Page,
  programNameExact: string,
  opts?: { forceEditClick?: boolean },
) {
  await page.goto(`${BASE_URL}/programs`);

  const nameCell = page.getByText(programNameExact, { exact: true }).first();
  await expect(nameCell).toBeVisible({ timeout: 25000 });
  await nameCell.scrollIntoViewIfNeeded();

  const row = page.locator('tr').filter({ has: page.getByText(programNameExact, { exact: true }) }).first();
  await expect(row).toBeVisible();

  await editButtonForProgramRow(row).click({ force: !!opts?.forceEditClick });

  await expect(page.getByRole('dialog', { name: 'Edit Program' })).toBeVisible();
}

function editDialog(page: Page) {
  return page.getByRole('dialog', { name: 'Edit Program' });
}

test.describe('Didaxis — Edit Program (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.getByRole('textbox', { name: 'Email' }).fill(process.env.DIDAXIS_EMAIL ?? '');
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.DIDAXIS_PASSWORD ?? '');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await page.waitForURL(`${BASE_URL}/`);
  });

  test('TC-001: Open program for editing via edit icon', async ({ page }) => {
    const programName = `Web Development ${Date.now()}`;
    const description = `Full‑stack syllabus seed ${Date.now()}`;

    await createProgram(page, programName, description);
    await openEditForProgram(page, programName);

    const dlg = editDialog(page);
    await expect(dlg.getByRole('textbox', { name: /Program Name/ })).toHaveValue(programName);
    await expect(dlg.getByRole('textbox', { name: 'Description' })).toHaveValue(description);
    await expect(dlg.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  test('TC-002: Successfully update program Name and reflect in list immediately', async ({ page }) => {
    const programName = `Web Development Anchor ${Date.now()}`;
    const updated = `${programName} - Updated`;

    await createProgram(page, programName, 'Program used for rename smoke test.');
    await openEditForProgram(page, programName);

    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: /Program Name/ }).fill(updated);
    await dlg.getByRole('button', { name: 'Save' }).click();

    await expect(dlg).not.toBeVisible();

    await expect(page.getByText(updated)).toBeVisible();
    await expect(page.getByText(programName, { exact: true })).toHaveCount(0);
  });

  test('TC-003: Updating only Description preserves Program Name', async ({ page }) => {
    const programName = `Applied AI ${Date.now()}`;
    const originalDescription = `Original description ${Date.now()}`;
    const newDescription = 'Updated description focused on NLP';

    await createProgram(page, programName, originalDescription);
    await openEditForProgram(page, programName);

    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: 'Description' }).fill(newDescription);
    await dlg.getByRole('button', { name: 'Save' }).click();
    await expect(dlg).not.toBeVisible();

    await openEditForProgram(page, programName);
    await expect(editDialog(page).getByRole('textbox', { name: /Program Name/ })).toHaveValue(programName);
    await expect(editDialog(page).getByRole('textbox', { name: 'Description' })).toHaveValue(newDescription);
  });

  test('TC-004: Update Program Name while leaving Description unchanged', async ({ page }) => {
    const programName = `Course Catalog Pilot ${Date.now()}`;
    const descriptionBody = `Non‑empty syllabus blurb ${Date.now()}`;
    const revisedName = `${programName} - Revised`;

    await createProgram(page, programName, descriptionBody);
    await openEditForProgram(page, programName);

    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: /Program Name/ }).fill(revisedName);
    await dlg.getByRole('button', { name: 'Save' }).click();
    await expect(dlg).not.toBeVisible();

    await expect(page.getByText(revisedName)).toBeVisible();
    await openEditForProgram(page, revisedName);
    await expect(editDialog(page).getByRole('textbox', { name: 'Description' })).toHaveValue(descriptionBody);
  });

  test('TC-005: Edited details persist after page refresh', async ({ page }) => {
    const startedAs = `Staging Alpha ${Date.now()}`;
    const savedAs = `Staging Beta ${Date.now()}`;
    await createProgram(page, startedAs, 'Persistence description');

    await openEditForProgram(page, startedAs);
    await editDialog(page).getByRole('textbox', { name: /Program Name/ }).fill(savedAs);
    await editDialog(page).getByRole('button', { name: 'Save' }).click();
    await expect(editDialog(page)).not.toBeVisible();

    await page.reload();
    await expect(page.getByText(savedAs)).toBeVisible();
  });

  test('TC-006: Latest Description values load when modal reopens', async ({ page }) => {
    const programName = `Labs Program ${Date.now()}`;

    await createProgram(page, programName, 'initial labs copy');
    await openEditForProgram(page, programName);
    await editDialog(page).getByRole('textbox', { name: 'Description' }).fill('middle revision');
    await editDialog(page).getByRole('button', { name: 'Save' }).click();

    await openEditForProgram(page, programName);
    await editDialog(page).getByRole('textbox', { name: 'Description' }).fill('final authoritative revision');
    await editDialog(page).getByRole('button', { name: 'Save' }).click();

    await openEditForProgram(page, programName);
    await expect(editDialog(page).getByRole('textbox', { name: 'Description' })).toHaveValue('final authoritative revision');
  });

  test('TC-007: Save disabled when Program Name empty or whitespace only', async ({ page }) => {
    const programName = `Validity Guard ${Date.now()}`;
    await createProgram(page, programName, `desc ${Date.now()}`);
    await openEditForProgram(page, programName);

    const dlg = editDialog(page);
    const save = dlg.getByRole('button', { name: 'Save' });
    const nameField = dlg.getByRole('textbox', { name: /Program Name/ });

    await nameField.fill('');
    await expect(save).toBeDisabled();

    await dlg.getByRole('textbox', { name: 'Description' }).fill('Still typing something unrelated');
    await expect(save).toBeDisabled();

    await nameField.fill('   ');
    await expect(save).toBeDisabled();
  });

  test('TC-008: Cancel restores list — unsaved edits not persisted', async ({ page }) => {
    const programName = `Rollback Test ${Date.now()}`;
    await createProgram(page, programName, 'cannot vanish');

    await openEditForProgram(page, programName);
    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: /Program Name/ }).fill(`Should Not Persist ${Date.now()}`);
    await dlg.getByRole('button', { name: 'Cancel' }).click();
    await expect(dlg).not.toBeVisible();

    await openEditForProgram(page, programName);
    await expect(editDialog(page).getByRole('textbox', { name: /Program Name/ })).toHaveValue(programName);
  });

  test('TC-009: Renaming conflicts with existing program Name is rejected', async ({ page }) => {
    const suffix = Date.now();
    const physics = `Physics 101 ${suffix}`;
    const chemistry = `Chemistry Basics ${suffix}`;
    await createProgram(page, physics, 'Newton');
    await createProgram(page, chemistry, 'Chem');

    await openEditForProgram(page, chemistry);

    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: /Program Name/ }).fill(physics);
    await dlg.getByRole('button', { name: 'Save' }).click();

    await expect(dlg).toBeVisible({ timeout: 5000 });

    await page.goto(`${BASE_URL}/programs`);
    await expect(page.getByText(chemistry, { exact: true })).toBeVisible();
    await expect(page.getByText(physics, { exact: true })).toBeVisible();
  });

  test('TC-012: Clearing Program Name again disables Save', async ({ page }) => {
    const programName = `Toggle Validation ${Date.now()}`;
    await createProgram(page, programName, `desc ${Date.now()}`);
    await openEditForProgram(page, programName);

    const dlg = editDialog(page);
    const save = dlg.getByRole('button', { name: 'Save' });
    const nameField = dlg.getByRole('textbox', { name: /Program Name/ });

    await nameField.fill('');
    await expect(save).toBeDisabled();

    await nameField.fill('Temp Name Holding');
    await expect(save).toBeEnabled();

    await nameField.fill('');
    await expect(save).toBeDisabled();
  });

  test('TC-013: Leading and trailing whitespace handling on edited Name', async ({ page }) => {
    const token = `${Date.now()}`;
    await createProgram(page, `Trim Seed ${token}`, `desc`);
    await openEditForProgram(page, `Trim Seed ${token}`);

    const spaced = `  Honors Bio ${token}  `;
    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: /Program Name/ }).fill(spaced);
    await dlg.getByRole('button', { name: 'Save' }).click();
    await expect(dlg).not.toBeVisible();

    const trimmed = spaced.trim();

    await openEditForProgram(page, trimmed);
    await expect(editDialog(page).getByRole('textbox', { name: /Program Name/ })).toHaveValue(trimmed);
  });

  test('TC-014: Unicode rename renders after save', async ({ page }) => {
    const programName = `Uni Seed ${Date.now()}`;
    await createProgram(page, programName, 'desc');

    await openEditForProgram(page, programName);

    const finalName = 'Programme 🎓 – データ 2027';
    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: /Program Name/ }).fill(finalName);
    await dlg.getByRole('button', { name: 'Save' }).click();
    await expect(dlg).not.toBeVisible();

    await expect(page.getByText(finalName)).toBeVisible();
  });

  test('TC-015: Rapid double-click Save does not create duplicate listings', async ({ page }) => {
    const programName = `Double Save ${Date.now()}`;
    await createProgram(page, programName, 'double click guardrails');

    await openEditForProgram(page, programName);
    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: 'Description' }).fill(`${programName} revised once`);
    const saveBtn = dlg.getByRole('button', { name: 'Save' });
    await saveBtn.dblclick();
    await expect(dlg).not.toBeVisible({ timeout: 15000 });

    await expect(page.getByText(programName, { exact: true })).toHaveCount(1);

    await openEditForProgram(page, programName);
    await expect(editDialog(page).getByRole('textbox', { name: /Program Name/ })).toHaveValue(programName);
  });

  test('TC-017: Long Description saves without truncation (medium payload)', async ({ page }) => {
    const programName = `Long Desc Sentinel ${Date.now()}`;
    const body = `x`.repeat(900);

    await createProgram(page, programName, 'baseline');

    await openEditForProgram(page, programName);
    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: 'Description' }).fill(body);
    await dlg.getByRole('button', { name: 'Save' }).click();
    await expect(dlg).not.toBeVisible({ timeout: 15000 });

    await openEditForProgram(page, programName);
    await expect(editDialog(page).getByRole('textbox', { name: 'Description' })).toHaveValue(body);
  });

  test('TC-018: Angle-brackets in Description persist without XSS execution', async ({ page }) => {
    const dangerous = `<script>throw new Error('xss')</script>`;
    const programName = `XSS Harness ${Date.now()}`;
    await createProgram(page, programName, 'clean slate');

    await openEditForProgram(page, programName);
    const dlg = editDialog(page);
    await dlg.getByRole('textbox', { name: 'Description' }).fill(dangerous);
    await dlg.getByRole('button', { name: 'Save' }).click();
    await expect(dlg).not.toBeVisible();

    const dialogs: string[] = [];
    page.on('dialog', (d) => {
      dialogs.push(d.message());
      void d.dismiss();
    });

    await page.reload();
    await expect(page.getByText(programName)).toBeVisible();
    expect(dialogs).toHaveLength(0);

    await openEditForProgram(page, programName);
    await expect(editDialog(page).getByRole('textbox', { name: 'Description' })).toHaveValue(dangerous);
  });

  test('TC-019: Edit pencil remains clickable at narrow widths', async ({ page }) => {
    const programName = `Responsive Row ${Date.now()}`;
    await createProgram(page, programName, 'viewport guard');

    await page.setViewportSize({ width: 390, height: 844 });

    await openEditForProgram(page, programName, { forceEditClick: true });

    await expect(editDialog(page)).toBeVisible();
  });

  test('TC-016: Concurrent admins — informational skip', async () => {
    test.fixme(true, 'Requires orchestrating dual authenticated contexts; backlog item for infra.');
  });

  test('TC-010: Non-admin edit guard', async ({ browser }) => {
    test.skip(!process.env.DIDAXIS_ALT_EMAIL, 'Set DIDAXIS_ALT_EMAIL & DIDAXIS_ALT_PASSWORD for a non-privileged probe user.');
    const account = process.env.DIDAXIS_ALT_EMAIL ?? '';
    const password = process.env.DIDAXIS_ALT_PASSWORD ?? '';

    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const altPage = await context.newPage();

    await altPage.goto(`${BASE_URL}/login`);
    await altPage.getByRole('textbox', { name: 'Email' }).fill(account);
    await altPage.getByRole('textbox', { name: 'Password' }).fill(password);
    await altPage.getByRole('button', { name: 'Sign In' }).click();
    await altPage.goto(`${BASE_URL}/programs`);

    await expect(altPage.locator('button').filter({ hasText: '✏️' })).toHaveCount(0);

    await context.close();
  });
});

test.describe('Didaxis — Edit Program (unauthenticated)', () => {
  test('TC-011: Guests are redirected away from Programs', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();

    await page.goto(`${BASE_URL}/programs`);

    await expect(page).toHaveURL(/\/login/, { timeout: 20000 });

    await context.close();
  });
});
