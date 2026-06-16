import { test, expect, trackProgram } from '../fixtures/cleanup.fixture';
import { DashboardPage } from '../pages/dashboard.page';
import { ProgramsPage } from '../pages/programs.page';
import {
  createProgramViaApi,
  deleteAllPrograms,
} from '../support/delete-program';

async function restoreSeedProgram(): Promise<void> {
  const id = await createProgramViaApi(
    `Restore Seed ${Date.now()}`,
    'Restored after empty-state test',
  );
  trackProgram(id);
}

test.describe('Didaxis — Program List Display (DS-5)', () => {
  test('TC-001: Display program list with key details (AC-1)', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Web Development 2026 ${Date.now()}`;
    const description = 'Full-stack web development program';

    await programs.createProgram(programName, description);

    await expect(programs.heading).toBeVisible();
    await expect(programs.programColumnHeader).toBeVisible();
    await expect(programs.programName(programName)).toBeVisible();
    await expect(programs.programDescription(programName, description)).toBeVisible();
    await expect(programs.editButtonFor(programName)).toBeVisible();
    await expect(programs.deleteButtonFor(programName)).toBeVisible();
  });

  test('TC-002: Multiple programs each show name and description (AC-1)', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const suffix = Date.now();
    const csName = `Computer Science BSc ${suffix}`;
    const csDescription = 'Undergraduate computer science degree';
    const nursingName = `Nursing Diploma ${suffix}`;
    const nursingDescription = 'Two-year practical nursing program';

    await programs.createProgram(csName, csDescription);
    await programs.createProgram(nursingName, nursingDescription);

    await expect(programs.programName(csName)).toBeVisible();
    await expect(programs.programDescription(csName, csDescription)).toBeVisible();
    await expect(programs.editButtonFor(csName)).toBeVisible();
    await expect(programs.deleteButtonFor(csName)).toBeVisible();

    await expect(programs.programName(nursingName)).toBeVisible();
    await expect(programs.programDescription(nursingName, nursingDescription)).toBeVisible();
    await expect(programs.editButtonFor(nursingName)).toBeVisible();
    await expect(programs.deleteButtonFor(nursingName)).toBeVisible();
  });

  test.describe('Empty state (serial)', () => {
    test.describe.configure({ mode: 'serial' });

    test('TC-003: Empty state when no programs exist (AC-2)', async ({ page }) => {
      const programs = new ProgramsPage(page);

      await deleteAllPrograms();
      try {
        await programs.goto();

        await expect(programs.emptyStateMessage).toBeVisible();
        await expect(programs.createProgramEmptyButton).toBeVisible();
        await expect(programs.programColumnHeader).not.toBeVisible();
        await expect(programs.programDataRows()).toHaveCount(0);
      } finally {
        await restoreSeedProgram();
      }
    });

    test('TC-004: Empty-state Create Program button opens the new program modal (AC-2)', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);

      await deleteAllPrograms();
      try {
        await programs.goto();
        await programs.openCreateFromEmptyState();

        const modal = programs.newProgramModal;
        await expect(modal.dialog).toBeVisible();
        await expect(modal.programNameInput).toBeVisible();
        await expect(modal.descriptionInput).toBeVisible();
      } finally {
        await restoreSeedProgram();
      }
    });

    test('TC-005: Programs page does not show stale data after last program is deleted', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const programName = `Transient Program ${Date.now()}`;

      await deleteAllPrograms();
      try {
        await programs.createProgram(programName, 'Single program removed to reach empty state');
        await programs.confirmDelete(programName, { skipGoto: true });

        await expect(programs.emptyStateMessage).toBeVisible();
        await expect(programs.programName(programName)).toHaveCount(0);
      } finally {
        await restoreSeedProgram();
      }
    });
  });

  test('TC-006: Empty state is not shown when programs exist', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Active Catalog Program ${Date.now()}`;

    await programs.createProgram(programName, 'Catalog program keeps the list view visible');

    await expect(programs.createProgramEmptyButton).not.toBeVisible();
    await expect(programs.emptyStateMessage).not.toBeVisible();
    await expect(programs.newProgramButton).toBeVisible();
    await expect(programs.programColumnHeader).toBeVisible();
  });

  test('TC-007: Program with long name and description displays in the list', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Long Program ${'A'.repeat(88)}${Date.now()}`.slice(0, 100);
    const description =
      'This is a multi-sentence description spanning several clauses. It documents labs, workshops, and co-op placements.';

    await programs.createProgram(programName, description);

    await expect(programs.programName(programName)).toBeVisible();
    await expect(programs.programDescription(programName, description)).toBeVisible();
  });

  test('TC-008: Program with special characters in name and description displays correctly', async ({
    page,
  }) => {
    const programs = new ProgramsPage(page);
    const suffix = Date.now();
    const programName = `CS & IT — "Honours" (2026) ${suffix}`;
    const description = 'Co-op & internship: 50% lab/workshop';

    await programs.createProgram(programName, description);

    await expect(programs.programName(programName)).toBeVisible();
    await expect(programs.programDescription(programName, description)).toBeVisible();
  });

  test('TC-009: Navigating to Programs via sidebar shows the same list', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const dashboard = new DashboardPage(page);
    const suffix = Date.now();
    const alpha = `Sidebar Alpha ${suffix}`;
    const beta = `Sidebar Beta ${suffix}`;

    await programs.createProgram(alpha, 'First program for sidebar navigation check');
    await programs.createProgram(beta, 'Second program visible after sidebar navigation');

    await dashboard.goto();
    await dashboard.navigation.goToPrograms();

    await expect(page).toHaveURL(/\/programs$/);
    await expect(programs.programName(alpha)).toBeVisible();
    await expect(programs.programDescription(alpha, 'First program for sidebar navigation check')).toBeVisible();
    await expect(programs.programName(beta)).toBeVisible();
    await expect(programs.programDescription(beta, 'Second program visible after sidebar navigation')).toBeVisible();
  });

  test('TC-010: Programs page accessibility: list region is keyboard reachable', async ({
    page,
  }) => {
    // @axe-core/playwright is not installed — add it to enable the WCAG 2.0 A/AA axe scan.
    const programs = new ProgramsPage(page);
    const programName = `Accessibility Program ${Date.now()}`;

    await programs.createProgram(programName, 'Program used for accessibility checks');
    await programs.goto();

    await programs.newProgramButton.focus();
    await expect(programs.newProgramButton).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(programs.newProgramModal.dialog).toBeVisible();
    await programs.newProgramModal.cancel();
  });
});
