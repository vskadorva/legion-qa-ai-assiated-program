import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages/programs.page';
import { buildProgramName, buildProgramPayload } from '../test-data/factories/program.factory';

test.describe('Didaxis — Delete Program with Confirmation (DS-4)', () => {
  test('TC-001: Delete program after confirming in dialog (AC-1)', { tag: '@smoke' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const { name: programName, description } = buildProgramPayload({
      name: buildProgramName('Test Program'),
      description: 'Program scheduled for confirmed deletion',
    });

    await programs.createProgram(programName, description);
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

  test('TC-002: Cancel deletion keeps program in list (AC-2)', { tag: '@e2e' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const { name: programName, description } = buildProgramPayload({
      name: buildProgramName('Retention Program'),
      description: 'Program that should remain after cancel',
    });

    await programs.createProgram(programName, description);
    await programs.cancelDelete(programName, { skipGoto: true });

    await expect(programs.programName(programName)).toBeVisible();
    await expect(programs.editButtonFor(programName)).toBeVisible();
    await expect(programs.deleteButtonFor(programName)).toBeVisible();
  });

  test('TC-003: Delete control alone does not remove the program', { tag: '@e2e' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const { name: programName, description } = buildProgramPayload({
      name: buildProgramName('Guard Program'),
      description: 'Program guarded until explicit confirmation',
    });

    await programs.createProgram(programName, description);

    let confirmationMessage = '';
    programs.deleteProgramConfirmModal.listenOnce(async (dialog) => {
      confirmationMessage = dialog.message();
      await dialog.dismiss();
    });
    await programs.openDeleteFor(programName, { skipGoto: true });

    expect(confirmationMessage).toMatch(/Delete program/i);
    await expect(programs.programName(programName)).toBeVisible();
  });

  test('TC-004: Deleting one program leaves other programs untouched', { tag: '@regression' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const alpha = buildProgramPayload({
      name: buildProgramName('Alpha Track'),
      description: 'First of two sibling programs',
    });
    const beta = buildProgramPayload({
      name: buildProgramName('Beta Track'),
      description: 'Second program that should survive deletion',
    });

    await programs.createProgram(alpha.name, alpha.description);
    await programs.createProgram(beta.name, beta.description);

    await programs.confirmDelete(alpha.name, { skipGoto: true });

    await expect(programs.programName(alpha.name)).toHaveCount(0);
    await expect(programs.programName(beta.name)).toBeVisible();
  });

  test('TC-005: Cancel then confirm still allows deletion', { tag: '@regression' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const { name: programName, description } = buildProgramPayload({
      name: buildProgramName('Deferred Delete'),
      description: 'Program deleted on second attempt',
    });

    await programs.createProgram(programName, description);
    await programs.cancelDelete(programName, { skipGoto: true });
    await expect(programs.programName(programName)).toBeVisible();

    await programs.confirmDelete(programName, { skipGoto: true });
    await expect(programs.programName(programName)).toHaveCount(0);
  });

  test('TC-006: Deleted program does not reappear after page refresh', { tag: '@regression' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const { name: programName, description } = buildProgramPayload({
      name: buildProgramName('Ephemeral Program'),
      description: 'Program removed permanently after refresh',
    });

    await programs.createProgram(programName, description);
    await programs.confirmDelete(programName, { skipGoto: true });
    await expect(programs.programName(programName)).toHaveCount(0);

    await page.reload();
    await expect(programs.programName(programName)).toHaveCount(0);
  });
});
