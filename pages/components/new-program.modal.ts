import type { Page } from '@playwright/test';

export class NewProgramModal {
  readonly dialog;
  readonly programNameInput;
  readonly descriptionInput;
  readonly createButton;
  readonly cancelButton;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'New Program' });
    this.programNameInput = this.dialog.getByRole('textbox', { name: 'Program Name' });
    this.descriptionInput = this.dialog.getByRole('textbox', { name: 'Description' });
    this.createButton = this.dialog.getByRole('button', { name: 'Create', exact: true });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
  }

  async fillProgramName(name: string) {
    await this.programNameInput.fill(name);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async fill(name: string, description: string) {
    await this.fillProgramName(name);
    await this.fillDescription(description);
  }

  async submit() {
    await this.createButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
