import type { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AppNavigation } from './components/app-navigation';

export class DashboardPage extends BasePage {
  readonly heading;
  readonly navigation: AppNavigation;
  readonly programsCard;
  readonly calendarCard;
  readonly validationCard;
  readonly aiAssistCard;

  constructor(page: Page) {
    super(page);
    const main = page.locator('main');
    const dashboardCards = main.locator('[class*="Card-root"]');
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.navigation = new AppNavigation(page);
    this.programsCard = dashboardCards.filter({ hasText: 'Manage academic programs' });
    this.calendarCard = dashboardCards.filter({ hasText: 'Schedule & drag-drop' });
    this.validationCard = dashboardCards.filter({ hasText: 'Check for conflicts' });
    this.aiAssistCard = dashboardCards.filter({ hasText: 'AI-powered editing' });
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/`);
  }

  async openProgramsCard() {
    await this.programsCard.click();
  }

  async openCalendarCard() {
    await this.calendarCard.click();
  }

  async openValidationCard() {
    await this.validationCard.click();
  }

  async openAiAssistCard() {
    await this.aiAssistCard.click();
  }
}
