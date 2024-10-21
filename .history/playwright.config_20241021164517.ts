import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30000, // 30-second timeout per test
  
  reporter: [
    ['list'],
    ['playwright-qase-reporter', {
      apiToken: process.env.QASE_TESTOPS_API_TOKEN,
      projectCode: process.env.QASE_TESTOPS_PROJECT, 
      runComplete: true,
      environment: process.env.QASE_ENVIRONMENT || 'production',
      logging: true
    }],
    ['html'],
  ],

  use: {
    headless: process.env.CI ? true : process.env.HEADLESS !== 'false', // Always headless in CI, else respect HEADLESS
    trace: process.env.CI ? 'on-first-retry' : 'off', // Enable trace in CI
    video: process.env.RECORD_VIDEO === 'true' ? 'on' : 'off', // Video recording if enabled
    screenshot: 'only-on-failure', // Capture screenshot on test failure
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    /* Uncomment to test cross-browser */
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Uncomment for local dev server */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  // },
});
