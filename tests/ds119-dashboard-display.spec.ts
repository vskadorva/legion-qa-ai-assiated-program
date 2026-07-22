import { test, expect } from '../fixtures/cleanup.fixture';
import { AiAssistPage } from '../pages/ai-assist.page';
import { CalendarPage } from '../pages/calendar.page';
import { DashboardPage } from '../pages/dashboard.page';
import { ProgramsPage } from '../pages/programs.page';
import { ValidationPage } from '../pages/validation.page';

test.describe('Didaxis — Dashboard display (DS-119)', () => {
  test('TC-001: Navigate to the Dashboard and see the right blocks', { tag: '@smoke' }, async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    await expect(dashboard.heading).toBeVisible();
    await expect(dashboard.welcomeMessage).toBeVisible();
    await expect(dashboard.cards.programsCard).toBeVisible();
    await expect(dashboard.cards.calendarCard).toBeVisible();
    await expect(dashboard.cards.validationCard).toBeVisible();
    await expect(dashboard.cards.aiAssistCard).toBeVisible();
  });

  test('TC-002: Programs card navigates to the Programs page', { tag: '@sanity' }, async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const programs = new ProgramsPage(page);

    await dashboard.goto();
    await dashboard.cards.openPrograms();

    await expect(page).toHaveURL(/\/programs$/);
    await expect(programs.heading).toBeVisible();
  });

  test('TC-003: Calendar card navigates to the Calendar page', { tag: '@sanity' }, async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const calendar = new CalendarPage(page);

    await dashboard.goto();
    await dashboard.cards.openCalendar();

    await expect(page).toHaveURL(/\/calendar$/);
    await expect(calendar.heading).toBeVisible();
  });

  test('TC-004: Validation card navigates to the Validation page', { tag: '@sanity' }, async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const validation = new ValidationPage(page);

    await dashboard.goto();
    await dashboard.cards.openValidation();

    await expect(page).toHaveURL(/\/validation$/);
    await expect(validation.heading).toBeVisible();
  });

  test('TC-005: AI Assist card navigates to the AI Assist page', { tag: '@sanity' }, async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const aiAssist = new AiAssistPage(page);

    await dashboard.goto();
    await dashboard.cards.openAiAssist();

    await expect(page).toHaveURL(/\/cli$/);
    await expect(aiAssist.heading).toBeVisible();
  });

  test('TC-006: Sidebar Dashboard link restores dashboard blocks', { tag: '@sanity' }, async ({ page }) => {
    const dashboard = new DashboardPage(page);
    const programs = new ProgramsPage(page);

    await programs.goto();
    await dashboard.navigation.goToDashboard();

    await expect(page).toHaveURL(/\/$/);
    await expect(dashboard.heading).toBeVisible();
    await expect(dashboard.cards.programsCard).toBeVisible();
    await expect(dashboard.cards.calendarCard).toBeVisible();
    await expect(dashboard.cards.validationCard).toBeVisible();
    await expect(dashboard.cards.aiAssistCard).toBeVisible();
  });
});
