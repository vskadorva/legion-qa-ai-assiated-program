import type { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { AppNavigation } from './components/app-navigation';
import { DeleteProgramConfirmModal } from './components/delete-program-confirm.modal';
import { EditProgramModal } from './components/edit-program.modal';
import { NewProgramModal } from './components/new-program.modal';

export class ProgramsPage extends BasePage {
  readonly heading;
  readonly newProgramButton;
  readonly createProgramEmptyButton;
  readonly emptyStateMessage;
  readonly programColumnHeader;
  readonly selectProgramHint;
  readonly semestersHeading;
  readonly addSemesterButton;
  readonly newProgramModal: NewProgramModal;
  readonly editProgramModal: EditProgramModal;
  readonly deleteProgramConfirmModal: DeleteProgramConfirmModal;
  readonly navigation: AppNavigation;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Programs' });
    this.newProgramButton = page.getByRole('button', { name: '+ New Program' });
    this.createProgramEmptyButton = page.getByRole('button', { name: 'Create Program' });
    this.emptyStateMessage = page.getByText(/no programs/i);
    this.programColumnHeader = page.getByRole('columnheader', { name: 'Program' });
    this.selectProgramHint = page.getByText(/select a program to manage semesters/i);
    this.semestersHeading = page.getByText('Semesters & scheduling config');
    this.addSemesterButton = page.getByRole('button', { name: '+ Semester' });
    this.newProgramModal = new NewProgramModal(page);
    this.editProgramModal = new EditProgramModal(page);
    this.deleteProgramConfirmModal = new DeleteProgramConfirmModal(page);
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

  programDescription(programName: string, description: string) {
    return this.programRow(programName).getByText(description, { exact: true });
  }

  programDataRows() {
    return this.page.getByRole('row').filter({ has: this.page.getByRole('button', { name: /^Edit / }) });
  }

  semesterPanel() {
    return this.page.locator('section').filter({ has: this.semestersHeading }).last();
  }

  semesterPanelProgramName(programName: string) {
    return this.semesterPanel().getByText(programName, { exact: true });
  }

  async selectProgramForSemesters(programName: string, opts?: { skipGoto?: boolean }) {
    if (!opts?.skipGoto) {
      await this.goto();
    }
    await this.programName(programName).first().waitFor({ state: 'visible', timeout: 25000 });
    await this.programName(programName).first().click();
  }

  editButtonFor(programName: string) {
    return this.programRow(programName).getByRole('button', { name: `Edit ${programName}` });
  }

  deleteButtonFor(programName: string) {
    return this.programRow(programName).getByRole('button', { name: `Delete ${programName}` });
  }

  allEditButtons() {
    return this.page.getByRole('button', { name: /^Edit / });
  }

  async openNewProgram() {
    await this.newProgramButton.click();
  }

  async openCreateFromEmptyState() {
    await this.createProgramEmptyButton.click();
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

  async openDeleteFor(programName: string, opts?: { skipGoto?: boolean }) {
    if (!opts?.skipGoto) {
      await this.goto();
    }
    await this.programName(programName).first().waitFor({ state: 'visible', timeout: 25000 });
    const row = this.programRow(programName);
    await row.scrollIntoViewIfNeeded();
    await this.deleteButtonFor(programName).click();
  }

  async confirmDelete(programName: string, opts?: { skipGoto?: boolean }) {
    this.deleteProgramConfirmModal.listenForAccept();
    await this.openDeleteFor(programName, opts);
  }

  async cancelDelete(programName: string, opts?: { skipGoto?: boolean }) {
    this.deleteProgramConfirmModal.listenForDismiss();
    await this.openDeleteFor(programName, opts);
  }
}
