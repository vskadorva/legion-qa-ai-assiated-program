import type { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AppNavigation } from './components/app-navigation';
import { EditProgramModal } from './components/edit-program.modal';
import { NewProgramModal } from './components/new-program.modal';

export class ProgramsPage extends BasePage {
  readonly heading;
  readonly newProgramButton;
  readonly createProgramEmptyButton;
  readonly programColumnHeader;
  readonly newProgramModal: NewProgramModal;
  readonly editProgramModal: EditProgramModal;
  readonly navigation: AppNavigation;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Programs' });
    this.newProgramButton = page.getByRole('button', { name: '+ New Program' });
    this.createProgramEmptyButton = page.getByRole('button', { name: 'Create Program' });
    this.programColumnHeader = page.getByRole('columnheader', { name: 'Program' });
    this.newProgramModal = new NewProgramModal(page);
    this.editProgramModal = new EditProgramModal(page);
    this.navigation = new AppNavigation(page);
  }

  async goto() {
    await this.page.goto(`${this.baseURL}/programs`);
  }

  programName(name: string) {
    return this.page.getByText(name, { exact: true });
  }

  programRow(programName: string) {
    return this.page.getByRole('row').filter({ has: this.page.getByText(programName, { exact: true }) }).first();
  }

  editButtonFor(programName: string) {
    return this.programRow(programName).getByRole('button', { name: `Edit ${programName}` });
  }

  deleteButtonFor(programName: string) {
    return this.page.getByRole('button', { name: `Delete ${programName}` });
  }

  allEditButtons() {
    return this.page.getByRole('button', { name: /^Edit / });
  }

  async openNewProgram() {
    await this.newProgramButton.click();
  }

  async createProgram(programName: string, description: string) {
    await this.goto();
    await this.openNewProgram();
    await this.newProgramModal.fill(programName, description);
    await this.newProgramModal.submit();
    await this.programName(programName).first().waitFor({ state: 'visible', timeout: 25000 });
  }

  async openEditFor(programName: string, opts?: { force?: boolean; skipGoto?: boolean }) {
    if (!opts?.skipGoto) {
      await this.goto();
    }
    await this.programName(programName).first().waitFor({ state: 'visible', timeout: 25000 });
    const row = this.programRow(programName);
    await row.scrollIntoViewIfNeeded();
    const editButton = this.editButtonFor(programName);
    if (opts?.force) {
      await editButton.dispatchEvent('click');
    } else {
      await editButton.click();
    }
  }
}
