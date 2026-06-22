import type { Page, Locator } from '@playwright/test';

/**
 * Dashboard stat cards lack button/link roles; scope to the SimpleGrid container
 * so card titles stay unique (Quick Start copy also mentions Calendar, etc.).
 */
export class DashboardCards {
  readonly grid: Locator;
  readonly programsCard: Locator;
  readonly calendarCard: Locator;
  readonly validationCard: Locator;
  readonly aiAssistCard: Locator;

  constructor(private readonly page: Page) {
    this.grid = page.locator('.mantine-SimpleGrid-root');
    this.programsCard = this.grid.getByText('Programs', { exact: true });
    this.calendarCard = this.grid.getByText('Calendar', { exact: true });
    this.validationCard = this.grid.getByText('Validation', { exact: true });
    this.aiAssistCard = this.grid.getByText('AI Assist', { exact: true });
  }

  async openPrograms() {
    await this.programsCard.click();
  }

  async openCalendar() {
    await this.calendarCard.click();
  }

  async openValidation() {
    await this.validationCard.click();
  }

  async openAiAssist() {
    await this.aiAssistCard.click();
  }
}
