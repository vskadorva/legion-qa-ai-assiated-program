import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { AUTH_FILE } from '../support/auth.constants';
import { LoginPage } from '../pages/login.page';

setup('authenticate', async ({ page }) => {
  const login = new LoginPage(page);

  await login.goto();
  await login.signIn(process.env.DIDAXIS_EMAIL ?? '', process.env.DIDAXIS_PASSWORD ?? '');

  await page.waitForURL(`${process.env.DIDAXIS_URL}/`);
  await expect(page).not.toHaveURL(/\/login/);

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await page.context().storageState({ path: AUTH_FILE });
});
