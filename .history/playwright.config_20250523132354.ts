import { defineConfig, devices } from '@playwright/test';

console.log("QASE_TESTOPS_API_TOKEN:", process.env.QASE_TESTOPS_API_TOKEN);
console.log("QASE_TESTOPS_PROJECT:", process.env.QASE_TESTOPS_PROJECT);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  globalTeardown: './utils/globalTeardown.ts',

  timeout: process.env.TEST_TIMEOUT ? Number(process.env.TEST_TIMEOUT) : 120000,

  reporter: [
    ['list'],
    ['playwright-qase-reporter', {
      apiToken: process.env.QASE_TESTOPS_API_TOKEN,
      projectCode: process.env.QASE_TESTOPS_PROJECT,
      environment: process.env.QASE_ENVIRONMENT || 'Invenio-RDM',
      uploadAttachments: true,
      runComplete: true,
      logging: true,
      debug: true,
    }],
    ['html']
  ],

  use: {
    headless: process.env.CI ? true : process.env.HEADLESS !== 'false',
    trace: process.env.CI ? 'on-first-retry' : 'off',
    video: process.env.RECORD_VIDEO === 'true' ? 'on' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
    actionTimeout: process.env.ACTION_TIMEOUT ? Number(process.env.ACTION_TIMEOUT) : 5000,
    navigationTimeout: process.env.NAVIGATION_TIMEOUT ? Number(process.env.NAVIGATION_TIMEOUT) : 10000,
  },
  
  /*
  TEST_TIMEOUT: This will set the global timeout for each test.
  ACTION_TIMEOUT: This will set the timeout for individual actions like clicks or typing. (Timeout specified in test are NOT changed)
  NAVIGATION_TIMEOUT: This will set the timeout for navigating between pages. 
  example - run from command line: TEST_TIMEOUT=120000 ACTION_TIMEOUT=8000 NAVIGATION_TIMEOUT=20000 npx playwright test
  */

  projects: [
    {
      name: 'chromium',  // Project for testing with Chromium browser
      use: { ...devices['Desktop Chrome'] },  // Use Desktop Chrome device profile for testing
    },
  ],
});