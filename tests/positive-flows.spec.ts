import { test, expect } from '../fixtures/cleanup.fixture';

const APP_URL = 'https://demo.playwright.dev/todomvc/#/';

const TODO_ITEMS = [
  'Buy groceries',
  'Clean the house',
  'Read a book',
  'Go for a walk',
];

test.describe('Positive Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test.describe('AC 1: Create a todo list', () => {
    test('TC-001: Todo list is created when the first item is added', { tag: '@smoke' }, async ({ page }) => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Buy groceries');
      await input.press('Enter');

      const todoItems = page.getByTestId('todo-item');
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.first()).toContainText('Buy groceries');

      await expect(page.getByText('1 item left')).toBeVisible();
      await expect(page.getByRole('link', { name: 'All' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Active' })).toBeVisible();
      await expect(page.getByRole('link', { name: 'Completed' })).toBeVisible();
    });
  });

  test.describe('AC 2: Add items (4)', () => {
    test('TC-002: Four todo items can be added sequentially', { tag: '@smoke' }, async ({ page }) => {
      const input = page.getByPlaceholder('What needs to be done?');

      for (const item of TODO_ITEMS) {
        await input.fill(item);
        await input.press('Enter');
      }

      const todoItems = page.getByTestId('todo-item');
      await expect(todoItems).toHaveCount(4);

      for (let i = 0; i < TODO_ITEMS.length; i++) {
        await expect(todoItems.nth(i)).toContainText(TODO_ITEMS[i]);
      }

      await expect(page.getByText('4 items left')).toBeVisible();
    });

    test('TC-003: Input field is cleared after adding a todo', { tag: '@sanity' }, async ({ page }) => {
      const input = page.getByPlaceholder('What needs to be done?');
      await input.fill('Buy groceries');
      await input.press('Enter');

      await expect(input).toHaveValue('');
    });
  });

  test.describe('AC 3: Finish item — Expect to be finished', () => {
    test.beforeEach(async ({ page }) => {
      const input = page.getByPlaceholder('What needs to be done?');
      for (const item of TODO_ITEMS) {
        await input.fill(item);
        await input.press('Enter');
      }
    });

    test('TC-004: Clicking the toggle checkbox marks a todo as completed', { tag: '@e2e' }, async ({ page }) => {
      const firstItem = page.getByTestId('todo-item').first();
      await firstItem.getByRole('checkbox').check();

      await expect(firstItem).toHaveClass(/completed/);
      await expect(page.getByText('3 items left')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Clear completed' })).toBeVisible();
    });

    test('TC-005: Completed items appear in the "Completed" filter', { tag: '@e2e' }, async ({ page }) => {
      const firstItem = page.getByTestId('todo-item').first();
      await firstItem.getByRole('checkbox').check();

      await page.getByRole('link', { name: 'Completed' }).click();

      const todoItems = page.getByTestId('todo-item');
      await expect(todoItems).toHaveCount(1);
      await expect(todoItems.first()).toContainText('Buy groceries');
    });

    test('TC-006: Completed item can be unchecked to reactivate', { tag: '@e2e' }, async ({ page }) => {
      const firstItem = page.getByTestId('todo-item').first();
      await firstItem.getByRole('checkbox').check();
      await expect(page.getByText('3 items left')).toBeVisible();

      await firstItem.getByRole('checkbox').uncheck();
      await expect(firstItem).not.toHaveClass(/completed/);
      await expect(page.getByText('4 items left')).toBeVisible();
    });
  });

  test.describe('AC 4: Remove item from the list — Expect to be removed', () => {
    test.beforeEach(async ({ page }) => {
      const input = page.getByPlaceholder('What needs to be done?');
      for (const item of TODO_ITEMS) {
        await input.fill(item);
        await input.press('Enter');
      }
    });

    test('TC-007: Hovering over a todo reveals the destroy button', { tag: '@e2e' }, async ({ page }) => {
      const thirdItem = page.getByTestId('todo-item').nth(2);
      await thirdItem.hover();

      const destroyButton = thirdItem.locator('button.destroy');
      await expect(destroyButton).toBeVisible();
    });

    test('TC-008: Clicking the destroy button removes the item from the list', { tag: '@e2e' }, async ({ page }) => {
      const thirdItem = page.getByTestId('todo-item').nth(2);
      await thirdItem.hover();
      await thirdItem.locator('button.destroy').click();

      const todoItems = page.getByTestId('todo-item');
      await expect(todoItems).toHaveCount(3);
      await expect(page.getByText('Read a book')).not.toBeVisible();
      await expect(page.getByText('3 items left')).toBeVisible();
    });

    test('TC-009: Removing the last item hides the list and footer', { tag: '@regression' }, async ({ page }) => {
      for (let i = 0; i < 4; i++) {
        const item = page.getByTestId('todo-item').first();
        await item.hover();
        await item.locator('button.destroy').click();
      }

      await expect(page.locator('.todo-list')).not.toBeVisible();
      await expect(page.locator('.footer')).not.toBeVisible();
      await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
    });
  });
});
