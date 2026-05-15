import { test, expect } from "@playwright/test";

const BASE_URL = process.env.DIDAXIS_URL!;

test.describe("Didaxis — Create Program", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page
      .getByRole("textbox", { name: "Email" })
      .fill(process.env.DIDAXIS_EMAIL ?? "");
    await page
      .getByRole("textbox", { name: "Password" })
      .fill(process.env.DIDAXIS_PASSWORD ?? "");
    await page.getByRole("button", { name: "Sign In" }).click();

    await page.waitForURL(`${BASE_URL}/`);
  });

  test("TC-001: Navigate to program creation form", async ({ page }) => {
    await page.goto(`${BASE_URL}/programs`);

    await page.getByRole("button", { name: "+ New Program" }).click();

    await expect(
      page.getByRole("dialog", { name: "New Program" }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Program Name" }),
    ).toBeVisible();
    await expect(
      page.getByRole("textbox", { name: "Description" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Create" })).toBeVisible();
  });

  test("TC-002: Successfully create a program with valid data", async ({
    page,
  }) => {
    const programName = `Web Development 2026 ${Date.now()}`;

    await page.goto(`${BASE_URL}/programs`);
    await page.getByRole("button", { name: "+ New Program" }).click();

    await page.getByRole("textbox", { name: "Program Name" }).fill(programName);
    await page
      .getByRole("textbox", { name: "Description" })
      .fill("Full-stack web development program");
    await page.getByRole("button", { name: "Create" }).click();

    await expect(
      page.getByRole("dialog", { name: "New Program" }),
    ).not.toBeVisible();
    await expect(page.getByText(programName)).toBeVisible();
  });
});
