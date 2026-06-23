import type { Page, Locator } from '@playwright/test';

export class DashboardCards {
  readonly programsCard: Locator;
  readonly calendarCard: Locator;
  readonly validationCard: Locator;
  readonly aiAssistCard: Locator;

  constructor(private readonly page: Page) {
    this.programsCard = page.getByText('Programs', { exact: true });
    this.calendarCard = page.getByText('Calendar', { exact: true });
    this.validationCard = page.getByText('Validation', { exact: true });
    this.aiAssistCard = page.getByText('AI Assist', { exact: true });
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
