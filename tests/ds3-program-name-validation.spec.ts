import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages/programs.page';
import { buildProgramName, buildProgramPayload } from '../test-data/factories/program.factory';
import {
  DUPLICATE_NAME_SCENARIO,
  INVALID_PROGRAM_NAMES,
} from '../test-data/invalid-program-names';

test.describe('Didaxis — Program Name Validation (DS-3)', () => {
  test('TC-001: Whitespace-only Program Name keeps Create disabled (AC-1)', { tag: '@sanity' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fillProgramName(INVALID_PROGRAM_NAMES.whitespaceOnly);
    await modal.fillDescription('Optional description for whitespace guard');

    await expect(modal.createButton).toBeDisabled();
    await expect(modal.dialog).toBeVisible();
  });

  test('TC-002: Program Name with special characters is accepted (AC-2)', { tag: '@e2e' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const { name, description } = buildProgramPayload({
      name: buildProgramName('Informatique & IA - Niveau 2'),
      description: 'French-language computing and AI track',
    });

    await programs.createProgram(name, description);

    await expect(programs.newProgramModal.dialog).not.toBeVisible();
    await expect(programs.programName(name)).toBeVisible();
  });

  test('TC-003: Duplicate Program Name on create is rejected (AC-3)', { tag: '@regression' }, async ({ page }) => {
    test.skip(true, 'Known demo bug — duplicate program names are allowed on create without an error message.');

    const programs = new ProgramsPage(page);
    const seedName = buildProgramName('Web Development 2026');

    await programs.createProgram(seedName, DUPLICATE_NAME_SCENARIO.seedDescription);

    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fill(seedName, DUPLICATE_NAME_SCENARIO.conflictDescription);
    await modal.submit();

    await expect(modal.dialog).toBeVisible({ timeout: 5000 });
    await expect(modal.duplicateNameError()).toBeVisible();
    await expect(programs.programName(seedName)).toHaveCount(1);
  });

  test('TC-004: Empty Program Name disables Create', { tag: '@regression' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fillProgramName(INVALID_PROGRAM_NAMES.empty);
    await modal.fillDescription('Description without a program name');

    await expect(modal.createButton).toBeDisabled();
    await expect(modal.dialog).toBeVisible();
  });

  test('TC-005: Clearing Program Name after typing disables Create again', { tag: '@regression' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    await programs.goto();
    await programs.openNewProgram();

    const modal = programs.newProgramModal;
    await modal.fillProgramName(buildProgramName('Draft Holding'));
    await expect(modal.createButton).toBeEnabled();

    await modal.fillProgramName(INVALID_PROGRAM_NAMES.empty);
    await expect(modal.createButton).toBeDisabled();
  });

  test('TC-006: Leading and trailing whitespace is trimmed on create', { tag: '@regression' }, async ({ page }) => {
    const programs = new ProgramsPage(page);
    const trimmedName = buildProgramName('Web Development Trim');
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

  test('TC-007: Duplicate create attempt leaves modal open without a second list row', { tag: '@regression' }, async ({ page }) => {
    test.skip(true, 'Known demo bug — duplicate program names are allowed on create without an error message.');

    const programs = new ProgramsPage(page);
    const seedName = buildProgramName('Duplicate Guard');

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
