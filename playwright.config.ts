import { defineConfig, devices } from '@playwright/test';

// PW_CHROMIUM_PATH: opsional, untuk memakai Chromium yang sudah terpasang di mesin
// (mis. /opt/pw-browsers/chromium). Di CI, `npx playwright install chromium` dipakai.
const executablePath = process.env.PW_CHROMIUM_PATH || undefined;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'off',
    // Locale dan zona waktu dikunci agar hasil tidak bergantung pada mesin.
    locale: 'id-ID',
    timezoneId: 'UTC',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], launchOptions: { executablePath, args: ['--no-sandbox'] } },
    },
  ],
  webServer: {
    command: 'npm run build && npx vite preview --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
