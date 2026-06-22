import { test, expect } from '../fixtures/cleanup.fixture';
import { AiAssistPage } from '../pages/ai-assist.page';
import { CalendarPage } from '../pages/calendar.page';
import { DashboardPage } from '../pages/dashboard.page';
import { ProgramsPage } from '../pages/programs.page';
import { ValidationPage } from '../pages/validation.page';

test.describe('Didaxis — Dashboard Display (DS-119)', () => {
  test('TC-001: Navigate to the Dashboard and see key blocks', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.heading).toBeVisible();
    await expect(dashboard.programsCard).toBeVisible();
    await expect(dashboard.calendarCard).toBeVisible();
    await expect(dashboard.validationCard).toBeVisible();
    await expect(dashboard.aiAssistCard).toBeVisible();
  });

  test('TC-002: Programs card navigates to the Programs page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const programs = new ProgramsPage(page);

    await dashboard.goto();
    await dashboard.openProgramsCard();

    await expect(page).toHaveURL(/\/programs$/);
    await expect(programs.heading).toBeVisible();
  });

  test('TC-003: Calendar card navigates to the Calendar page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const calendar = new CalendarPage(page);

    await dashboard.goto();
    await dashboard.openCalendarCard();

    await expect(page).toHaveURL(/\/calendar$/);
    await expect(calendar.heading).toBeVisible();
  });

  test('TC-004: Validation card navigates to the Validation page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const validation = new ValidationPage(page);

    await dashboard.goto();
    await dashboard.openValidationCard();

    await expect(page).toHaveURL(/\/validation$/);
    await expect(validation.heading).toBeVisible();
  });

  test('TC-005: AI Assist card navigates to the AI Assist page', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const aiAssist = new AiAssistPage(page);

    await dashboard.goto();
    await dashboard.openAiAssistCard();

    await expect(page).toHaveURL(/\/cli$/);
    await expect(aiAssist.heading).toBeVisible();
  });
});
