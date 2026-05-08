import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  reporter: [['html', { open: 'never' }]],
  use: {
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on',
  },
});
