import type { Page } from '@playwright/test';

export class EditProgramModal {
  readonly dialog;
  readonly programNameInput;
  readonly descriptionInput;
  readonly saveButton;
  readonly cancelButton;

  constructor(page: Page) {
    this.dialog = page.getByRole('dialog', { name: 'Edit Program' });
    this.programNameInput = this.dialog.getByRole('textbox', { name: 'Program Name' });
    this.descriptionInput = this.dialog.getByRole('textbox', { name: 'Description' });
    this.saveButton = this.dialog.getByRole('button', { name: 'Save' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
  }

  async fillProgramName(name: string) {
    await this.programNameInput.fill(name);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async save() {
    await this.saveButton.click();
  }

  async saveDoubleClick() {
    await this.saveButton.dblclick();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
