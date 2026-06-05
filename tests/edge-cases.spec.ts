import { test, expect } from "../fixtures/cleanup.fixture";

const APP_URL = "https://demo.playwright.dev/todomvc/#/";

const TODO_ITEMS = [
  "Buy groceries",
  "Clean the house",
  "Read a book",
  "Go for a walk",
];

test.describe("Edge Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test("TC-015: Special characters are preserved in todo text", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    const specialText = "<script>alert('xss')</script>";
    await input.fill(specialText);
    await input.press("Enter");

    const todoItem = page.getByTestId("todo-item").first();
    await expect(todoItem).toContainText(specialText);

    const alerts: string[] = [];
    page.on("dialog", (dialog) => {
      alerts.push(dialog.message());
      dialog.dismiss();
    });
    expect(alerts).toHaveLength(0);
  });

  test("TC-016: Duplicate todo items can be added", async ({ page }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("Buy groceries");
    await input.press("Enter");
    await input.fill("Buy groceries");
    await input.press("Enter");

    const todoItems = page.getByTestId("todo-item");
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems.nth(0)).toContainText("Buy groceries");
    await expect(todoItems.nth(1)).toContainText("Buy groceries");
  });

  test("TC-017: Very long todo text is handled gracefully", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    const longText = "A".repeat(500);
    await input.fill(longText);
    await input.press("Enter");

    const todoItem = page.getByTestId("todo-item").first();
    await expect(todoItem).toBeVisible();
    await expect(todoItem).toContainText(longText);

    const boundingBox = await todoItem.boundingBox();
    expect(boundingBox).not.toBeNull();
    expect(boundingBox!.width).toBeGreaterThan(0);
    expect(boundingBox!.height).toBeGreaterThan(0);
  });

  test('TC-018: "Mark all as complete" toggles all items at once', async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    for (const item of TODO_ITEMS) {
      await input.fill(item);
      await input.press("Enter");
    }

    await page.getByLabel("Mark all as complete").check();

    const todoItems = page.getByTestId("todo-item");
    for (let i = 0; i < 4; i++) {
      await expect(todoItems.nth(i)).toHaveClass(/completed/);
    }

    await expect(page.getByText("0 items left")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Clear completed" }),
    ).toBeVisible();
  });

  test('TC-019: "Clear completed" removes all completed items', async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    for (const item of TODO_ITEMS) {
      await input.fill(item);
      await input.press("Enter");
    }

    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(0).getByRole("checkbox").check();
    await todoItems.nth(1).getByRole("checkbox").check();

    await page.getByRole("button", { name: "Clear completed" }).click();

    const remainingItems = page.getByTestId("todo-item");
    await expect(remainingItems).toHaveCount(2);
    await expect(remainingItems.nth(0)).toContainText("Read a book");
    await expect(remainingItems.nth(1)).toContainText("Go for a walk");
    await expect(page.getByText("2 items left")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Clear completed" }),
    ).not.toBeVisible();
  });

  test("TC-020: Double-clicking a todo enables inline editing", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("Buy groceries");
    await input.press("Enter");

    const todoItem = page.getByTestId("todo-item").first();
    await todoItem.getByText("Buy groceries").dblclick();

    const editInput = todoItem.getByRole("textbox");
    await expect(editInput).toBeVisible();
    await expect(editInput).toHaveValue("Buy groceries");
  });

  test("TC-021: Editing a todo and pressing Enter saves changes", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("Buy groceries");
    await input.press("Enter");

    const todoItem = page.getByTestId("todo-item").first();
    await todoItem.getByText("Buy groceries").dblclick();

    const editInput = todoItem.getByRole("textbox");
    await editInput.fill("Buy organic groceries");
    await editInput.press("Enter");

    await expect(todoItem).toContainText("Buy organic grcoeries");
    await expect(todoItem.getByRole("textbox")).not.toBeVisible();
  });

  test("TC-022: Editing a todo and pressing Escape cancels changes", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("Buy groceries");
    await input.press("Enter");

    const todoItem = page.getByTestId("todo-item").first();
    await todoItem.getByText("Buy groceries").dblclick();

    const editInput = todoItem.getByRole("textbox");
    await editInput.fill("Something else");
    await editInput.press("Escape");

    await expect(todoItem).toContainText("Buy groceries");
  });

  test("TC-023: Editing a todo to empty string removes it", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("Buy groceries");
    await input.press("Enter");

    const todoItem = page.getByTestId("todo-item").first();
    await todoItem.getByText("Buy groceries").dblclick();

    const editInput = todoItem.getByRole("textbox");
    await editInput.fill("");
    await editInput.press("Enter");

    await expect(page.getByTestId("todo-item")).toHaveCount(0);
  });

  test("TC-024: Todo state persists after page refresh", async ({ page }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    for (const item of TODO_ITEMS) {
      await input.fill(item);
      await input.press("Enter");
    }

    await page.getByTestId("todo-item").first().getByRole("checkbox").check();

    await page.reload();

    const todoItems = page.getByTestId("todo-item");
    await expect(todoItems).toHaveCount(4);
    await expect(todoItems.nth(0)).toHaveClass(/completed/);
    await expect(todoItems.nth(1)).not.toHaveClass(/completed/);
    await expect(todoItems.nth(2)).not.toHaveClass(/completed/);
    await expect(todoItems.nth(3)).not.toHaveClass(/completed/);
    await expect(page.getByText("3 items left")).toBeVisible();
  });

  test("TC-025: Leading and trailing whitespace is trimmed from todo text", async ({
    page,
  }) => {
    const input = page.getByPlaceholder("What needs to be done?");
    await input.fill("   Buy groceries   ");
    await input.press("Enter");

    const todoItem = page.getByTestId("todo-item").first();
    const label = todoItem.getByTestId("todo-title");
    await expect(label).toHaveText("Buy groceries");
  });
});
