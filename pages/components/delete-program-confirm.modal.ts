import type { Dialog, Page } from '@playwright/test';

export class DeleteProgramConfirmModal {
  constructor(private readonly page: Page) {}

  listenForAccept(): void {
    this.page.once('dialog', (dialog) => dialog.accept());
  }

  listenForDismiss(): void {
    this.page.once('dialog', (dialog) => dialog.dismiss());
  }

  listenOnce(handler: (dialog: Dialog) => Promise<void>): void {
    this.page.once('dialog', handler);
  }
}
