import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages/programs.page';

test.describe('Didaxis — Delete Program with Confirmation (DS-4)', () => {
  test('TC-001: Delete program after confirming in dialog (AC-1)', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Test Program ${Date.now()}`;

    await programs.createProgram(programName, 'Program scheduled for confirmed deletion');
    await expect(programs.programName(programName)).toBeVisible();

    let confirmationMessage = '';
    programs.deleteProgramConfirmModal.listenOnce(async (dialog) => {
      confirmationMessage = dialog.message();
      await dialog.accept();
    });
    await programs.openDeleteFor(programName, { skipGoto: true });

    expect(confirmationMessage).toContain(`Delete program "${programName}"`);
    await expect(programs.programName(programName)).toHaveCount(0);
  });

  test('TC-002: Cancel deletion keeps program in list (AC-2)', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Retention Program ${Date.now()}`;

    await programs.createProgram(programName, 'Program that should remain after cancel');
    await programs.cancelDelete(programName, { skipGoto: true });

    await expect(programs.programName(programName)).toBeVisible();
    await expect(programs.editButtonFor(programName)).toBeVisible();
    await expect(programs.deleteButtonFor(programName)).toBeVisible();
  });

  test('TC-003: Delete control alone does not remove the program', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Guard Program ${Date.now()}`;

    await programs.createProgram(programName, 'Program guarded until explicit confirmation');

    let confirmationMessage = '';
    programs.deleteProgramConfirmModal.listenOnce(async (dialog) => {
      confirmationMessage = dialog.message();
      await dialog.dismiss();
    });
    await programs.openDeleteFor(programName, { skipGoto: true });

    expect(confirmationMessage).toMatch(/Delete program/i);
    await expect(programs.programName(programName)).toBeVisible();
  });

  test('TC-004: Deleting one program leaves other programs untouched', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const suffix = Date.now();
    const alpha = `Alpha Track ${suffix}`;
    const beta = `Beta Track ${suffix}`;

    await programs.createProgram(alpha, 'First of two sibling programs');
    await programs.createProgram(beta, 'Second program that should survive deletion');

    await programs.confirmDelete(alpha, { skipGoto: true });

    await expect(programs.programName(alpha)).toHaveCount(0);
    await expect(programs.programName(beta)).toBeVisible();
  });

  test('TC-005: Cancel then confirm still allows deletion', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Deferred Delete ${Date.now()}`;

    await programs.createProgram(programName, 'Program deleted on second attempt');
    await programs.cancelDelete(programName, { skipGoto: true });
    await expect(programs.programName(programName)).toBeVisible();

    await programs.confirmDelete(programName, { skipGoto: true });
    await expect(programs.programName(programName)).toHaveCount(0);
  });

  test('TC-006: Deleted program does not reappear after page refresh', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Ephemeral Program ${Date.now()}`;

    await programs.createProgram(programName, 'Program removed permanently after refresh');
    await programs.confirmDelete(programName, { skipGoto: true });
    await expect(programs.programName(programName)).toHaveCount(0);

    await page.reload();
    await expect(programs.programName(programName)).toHaveCount(0);
  });
});
