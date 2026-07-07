import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages/programs.page';

test.describe('Didaxis — Create Program (DS-1)', () => {
  test('TC-001: Navigate to program creation form', { tag: '@smoke' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await expect(modal.dialog).toBeVisible();
    await expect(modal.programNameInput).toBeVisible();
    await expect(modal.descriptionInput).toBeVisible();
    await expect(modal.createButton).toBeVisible();
  });

  test('TC-002: Successfully create a program with valid data', { tag: '@smoke' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Web Development 2026 ${Date.now()}`;

    await programs.createProgram(programName, 'Full-stack web development program');

    await expect(programs.newProgramModal.dialog).not.toBeVisible();
    await expect(programs.programName(programName)).toBeVisible();
  });

  test('TC-003: Validation prevents empty program name', { tag: '@sanity' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await expect(modal.programNameInput).toHaveValue('');
    await expect(modal.createButton).toBeDisabled();
  });

  test('TC-004: Cancel closes modal without adding program to list', { tag: '@e2e' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Draft Program Cancel Test ${Date.now()}`;

    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fill(programName, 'This draft should not be saved');
    await modal.cancel();

    await expect(modal.dialog).not.toBeVisible();
    await expect(programs.programName(programName)).toHaveCount(0);
    await expect(programs.editButtonFor(programName)).toHaveCount(0);
  });

  test('TC-005: Reopening New Program after cancel shows a fresh empty form', { tag: '@regression' }, async ({ page }) => {
    test.fail(true, 'Known demo bug — New Program modal retains draft values after Cancel.');

    const programs = new ProgramsPage(page);
    const staleName = `Stale Draft Name ${Date.now()}`;

    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fillProgramName(staleName);
    await modal.cancel();

    await programs.openNewProgram();

    await expect(modal.dialog).toBeVisible();
    await expect(modal.programNameInput).toHaveValue('');
    await expect(modal.createButton).toBeDisabled();
  });
});
