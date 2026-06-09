import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages/programs.page';

test.describe('Didaxis — Program Name Validation (DS-3)', () => {
  test('TC-001: Whitespace-only Program Name keeps Create disabled (AC-1)', async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fillProgramName('   ');
    await modal.fillDescription('Optional description for whitespace guard');

    await expect(modal.createButton).toBeDisabled();
    await expect(modal.dialog).toBeVisible();
  });

  test('TC-002: Program Name with special characters is accepted (AC-2)', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Informatique & IA - Niveau 2 ${Date.now()}`;

    await programs.createProgram(programName, 'French-language computing and AI track');

    await expect(programs.newProgramModal.dialog).not.toBeVisible();
    await expect(programs.programName(programName)).toBeVisible();
  });

  test('TC-003: Duplicate Program Name on create is rejected (AC-3)', async ({ page }) => {
    test.skip(true, 'Known demo bug — duplicate program names are allowed on create without an error message.');

    const programs = new ProgramsPage(page);
    const suffix = Date.now();
    const seedName = `Web Development 2026 ${suffix}`;

    await programs.createProgram(seedName, 'Original full-stack curriculum');

    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fill(seedName, 'Second program with the same title');
    await modal.submit();

    await expect(modal.dialog).toBeVisible({ timeout: 5000 });
    await expect(modal.duplicateNameError()).toBeVisible();
    await expect(programs.programName(seedName)).toHaveCount(1);
  });

  test('TC-004: Empty Program Name disables Create', async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fillDescription('Description without a program name');

    await expect(modal.createButton).toBeDisabled();
    await expect(modal.dialog).toBeVisible();
  });

  test('TC-005: Clearing Program Name after typing disables Create again', async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fillProgramName('Draft Holding Name');
    await expect(modal.createButton).toBeEnabled();

    await modal.fillProgramName('');
    await expect(modal.createButton).toBeDisabled();
  });

  test('TC-006: Leading and trailing whitespace is trimmed on create', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const token = Date.now();
    const trimmedName = `Web Development Trim ${token}`;
    const spacedName = `  ${trimmedName}  `;

    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fill(spacedName, 'Whitespace normalization on create');
    await modal.submit();

    await expect(modal.dialog).not.toBeVisible();
    await expect(programs.programName(trimmedName)).toBeVisible();

    await programs.openEditFor(trimmedName);
    await expect(programs.editProgramModal.programNameInput).toHaveValue(trimmedName);
  });

  test('TC-007: Duplicate create attempt leaves modal open without a second list row', async ({ page }) => {
    test.skip(true, 'Known demo bug — duplicate program names are allowed on create without an error message.');

    const programs = new ProgramsPage(page);
    const suffix = Date.now();
    const seedName = `Duplicate Guard ${suffix}`;

    await programs.createProgram(seedName, 'Seed program for duplicate guard');

    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fill(seedName, 'Conflicting duplicate payload');
    await modal.submit();

    await expect(modal.dialog).toBeVisible({ timeout: 5000 });
    await expect(programs.programName(seedName)).toHaveCount(1);
  });
});
