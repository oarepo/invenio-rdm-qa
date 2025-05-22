import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 3,  // Retry failed tests up to 3 times
  reporter: [
    ['json', { outputFile: 'test-results.json' }],
    ['playwright-qase-reporter', {
      testops: {
        api: {
          token: process.env.QASE_TESTOPS_API_TOKEN,
        },
        project: process.env.QASE_TESTOPS_PROJECT,
        environment: process.env.QASE_ENVIRONMENT || 'production',
        uploadAttachments: true,
        run: {
          complete: false,  // Do not complete the run yet
        },
      },
    }],
  ],
  use: {
    headless: true,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

    /*
  TEST_TIMEOUT: This will set the global timeout for each test.
  ACTION_TIMEOUT: This will set the timeout for individual actions like clicks or typing. (Timeout specified in test are NOT changed)
  NAVIGATION_TIMEOUT: This will set the timeout for navigating between pages. 
  example - run from command line: TEST_TIMEOUT=120000 ACTION_TIMEOUT=8000 NAVIGATION_TIMEOUT=20000 npx playwright test
  */