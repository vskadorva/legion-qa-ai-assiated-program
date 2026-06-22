import type { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AppNavigation } from './components/app-navigation';
import { DashboardCards } from './components/dashboard-cards';

export class DashboardPage extends BasePage {
  readonly heading;
  readonly welcomeMessage;
  readonly navigation: AppNavigation;
  readonly cards: DashboardCards;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Dashboard' });
    this.welcomeMessage = page.getByText('Welcome to Didaxis Studio');
    this.navigation = new AppNavigation(page);
    this.cards = new DashboardCards(page);
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/`);
  }
}
