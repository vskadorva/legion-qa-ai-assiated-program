import type { Page } from '@playwright/test';

export class AppNavigation {
  readonly dashboardButton;
  readonly programsButton;
  readonly calendarButton;
  readonly validationButton;
  readonly schedulerButton;
  readonly exportButton;
  readonly settingsButton;
  readonly signOutButton;

  constructor(private readonly page: Page) {
    this.dashboardButton = page.getByRole('button', { name: '📊 Dashboard' });
    this.programsButton = page.getByRole('button', { name: '🎓 Programs' });
    this.calendarButton = page.getByRole('button', { name: '📅 Calendar' });
    this.validationButton = page.getByRole('button', { name: '✅ Validation' });
    this.schedulerButton = page.getByRole('button', { name: '⚡ Scheduler' });
    this.exportButton = page.getByRole('button', { name: '📤 Export' });
    this.settingsButton = page.getByRole('button', { name: '⚙️ Settings' });
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
  }

  async goToPrograms() {
    await this.programsButton.click();
  }

  async signOut() {
    await this.signOutButton.click();
  }
}
