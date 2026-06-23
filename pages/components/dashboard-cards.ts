import type { Page, Locator } from '@playwright/test';

export class DashboardCards {
  readonly main: Locator;
  readonly programsCard: Locator;
  readonly calendarCard: Locator;
  readonly validationCard: Locator;
  readonly aiAssistCard: Locator;

  constructor(page: Page) {
    this.main = page.getByRole('main');
    // Quick Start repeats card names later in the main region; the card title appears first.
    this.programsCard = this.main.getByText('Programs', { exact: true }).first();
    this.calendarCard = this.main.getByText('Calendar', { exact: true }).first();
    this.validationCard = this.main.getByText('Validation', { exact: true }).first();
    this.aiAssistCard = this.main.getByText('AI Assist', { exact: true }).first();
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
