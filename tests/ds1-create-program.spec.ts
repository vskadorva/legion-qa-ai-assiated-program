import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages/programs.page';

test.describe('Didaxis — Create Program', () => {
  test('TC-001: Navigate to program creation form', async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await expect(modal.dialog).toBeVisible();
    await expect(modal.programNameInput).toBeVisible();
    await expect(modal.descriptionInput).toBeVisible();
    await expect(modal.createButton).toBeVisible();
  });
  test('TC-002: Successfully create a program with valid data', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Web Development 2026 ${Date.now()}`;

    await programs.createProgram(programName, 'Full-stack web development program');

    await expect(programs.newProgramModal.dialog).not.toBeVisible();
    await expect(programs.programName(programName)).toBeVisible();
  });
});
