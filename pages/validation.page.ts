import type { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AppNavigation } from './components/app-navigation';

export class ValidationPage extends BasePage {
  readonly heading;
  readonly navigation: AppNavigation;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Validation' });
    this.navigation = new AppNavigation(page);
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/validation`);
  }
}
