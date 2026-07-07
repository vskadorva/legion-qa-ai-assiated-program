import { test, expect } from '../fixtures/cleanup.fixture';

const APP_URL = 'https://demo.playwright.dev/todomvc/#/';

const TODO_ITEMS = [
  'Buy groceries',
  'Clean the house',
  'Read a book',
  'Go for a walk',
];

test.describe('Negative Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('TC-010: Empty input does not create a todo', { tag: '@regression' }, async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    await expect(page.locator('.footer')).not.toBeVisible();
  });

  test('TC-011: Whitespace-only input does not create a todo', { tag: '@regression' }, async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('   ');
    await input.press('Enter');

    await expect(page.getByTestId('todo-item')).toHaveCount(0);
    await expect(page.locator('.footer')).not.toBeVisible();
  });

  test('TC-012: Completed items are not counted in "items left"', { tag: '@regression' }, async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    for (const item of TODO_ITEMS) {
      await input.fill(item);
      await input.press('Enter');
    }

    const todoItems = page.getByTestId('todo-item');
    await todoItems.nth(0).getByRole('checkbox').check();
    await todoItems.nth(1).getByRole('checkbox').check();

    await expect(page.getByText('2 items left')).toBeVisible();
  });

  test('TC-013: Active filter does not show completed items', { tag: '@regression' }, async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    for (const item of TODO_ITEMS) {
      await input.fill(item);
      await input.press('Enter');
    }

    const todoItems = page.getByTestId('todo-item');
    await todoItems.first().getByRole('checkbox').check();

    await page.getByRole('link', { name: 'Active' }).click();

    const visibleItems = page.getByTestId('todo-item');
    await expect(visibleItems).toHaveCount(3);
    await expect(page.getByText('Buy groceries')).not.toBeVisible();
  });

  test('TC-014: Destroy button is not visible without hovering', { tag: '@regression' }, async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const destroyButton = page.getByTestId('todo-item').first().getByRole('button');
    await expect(destroyButton).toBeHidden();
  });
});
