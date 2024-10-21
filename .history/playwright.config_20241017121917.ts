import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Adding the Qase reporter
  reporter: [
    ['list'], // Default reporter for displaying test results
    ['playwright-qase-reporter', {
      apiToken: process.env.QASE_TESTOPS_API_TOKEN,
      projectCode: process.env.QASE_TESTOPS_PROJECT, 
      runComplete: true, // Upload test results after all tests are complete
      environment: process.env.QASE_ENVIRONMENT || 'production', // Environment (production, staging, etc.)
      logging: true // Enable logging for debugging
    }],
    ['html'], // Generate an HTML report
  ],

  use: {
    headless: true, // Ensures tests run in headless mode
    trace: 'on-first-retry', // Collect trace on the first test retry
    
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
   /* {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    */
  ],

  /* Uncomment the section below if you are running a local dev server before tests */
  /* webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  }, */
});
