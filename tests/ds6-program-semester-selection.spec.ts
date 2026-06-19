import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages/programs.page';

test.describe('Didaxis — Program Semester Selection (DS-6)', () => {
  test.use({ viewport: { width: 1400, height: 900 } });

  test('TC-001: Selecting a program reveals the semester management panel', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const programName = `Semester Panel Program ${Date.now()}`;

    await programs.createProgram(programName, 'Program used to verify semester panel selection');
    await programs.goto();

    await expect(programs.selectProgramHint).toBeVisible();
    await expect(programs.semestersHeading).not.toBeVisible();
    await expect(programs.addSemesterButton).not.toBeVisible();

    await programs.selectProgramForSemesters(programName, { skipGoto: true });

    await expect(programs.selectProgramHint).not.toBeVisible();
    await expect(programs.semestersHeading).toBeVisible();
    await expect(programs.addSemesterButton).toBeVisible();
    await expect(programs.semesterPanelProgramName(programName)).toBeVisible();
  });

  test('TC-002: Switching program selection updates the semester panel context', async ({ page }) => {
    const programs = new ProgramsPage(page);
    const suffix = Date.now();
    const alpha = `Semester Alpha ${suffix}`;
    const beta = `Semester Beta ${suffix}`;

    await programs.createProgram(alpha, 'First program for semester panel switching');
    await programs.createProgram(beta, 'Second program for semester panel switching');
    await programs.goto();

    await programs.selectProgramForSemesters(alpha, { skipGoto: true });
    await expect(programs.semesterPanelProgramName(alpha)).toBeVisible();
    await expect(programs.semesterPanelProgramName(beta)).toHaveCount(0);

    await programs.selectProgramForSemesters(beta, { skipGoto: true });
    await expect(programs.semesterPanelProgramName(beta)).toBeVisible();
    await expect(programs.semesterPanelProgramName(alpha)).toHaveCount(0);
  });
});
