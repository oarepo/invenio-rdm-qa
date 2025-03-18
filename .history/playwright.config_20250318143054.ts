import { defineConfig, devices } from '@playwright/test';

console.log("QASE_TESTOPS_API_TOKEN:", process.env.QASE_TESTOPS_API_TOKEN);
console.log("QASE_TESTOPS_PROJECT:", process.env.QASE_TESTOPS_PROJECT);

// Function for waiting between attempts
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default defineConfig({
  testDir: './tests',  // Directory where tests are located
  fullyParallel: true,  // Run tests in parallel
  forbidOnly: !!process.env.CI,  // Disallow '.only' on tests in CI to prevent accidental skipping
  retries: process.env.CI ? 2 : 0,  // Retry failed tests only in CI (2 retries), none locally
  workers: process.env.CI ? 1 : undefined,  // Limit to 1 worker in CI (to avoid overloading the system), undefined for local
  globalTeardown: './utils/globalTeardown.ts', // Link to teardown file - in this file you can set exit code

  timeout: process.env.TEST_TIMEOUT ? Number(process.env.TEST_TIMEOUT) : 120000, // Global test timeout (default: 120 seconds)

  reporter: [
    ['list'],  // Use the list reporter for test results in the terminal (you can use: json, html, allure format etc)
    ['playwright-qase-reporter', {
      debug: true,  // Enable debug mode for the QASE reporter
      testops: {
        api: {
          token: process.env.QASE_TESTOPS_API_TOKEN,  // API token for QASE integration
        },
        project: process.env.QASE_TESTOPS_PROJECT,  // Project identifier for QASE
        environment: process.env.QASE_ENVIRONMENT || 'production',  // Set the environment for QASE
        uploadAttachments: true,  // Enable uploading attachments (screenshots/videos) on failure
        run: {
          complete: true,  // Mark the test run as complete in QASE
        },
      },
      logging: true,  // Enable logging for extra visibility
    }],
    ['html'],  // Generate an HTML report for test results
  ],

  use: {
    headless: process.env.CI ? true : process.env.HEADLESS !== 'false', // Always run in headless mode on CI, else based on HEADLESS environment variable
    trace: process.env.CI ? 'on-first-retry' : 'off',  // Enable trace for failed retries in CI, disable otherwise
    video: process.env.RECORD_VIDEO === 'true' ? 'on' : 'retain-on-failure',  // Record videos if enabled, or only on failure
    screenshot: 'only-on-failure',  // Capture screenshot only when a test fails
    ignoreHTTPSErrors: true,  // Ignore HTTPS errors during tests

    // Customizable timeouts through environment variables or default values
    actionTimeout: process.env.ACTION_TIMEOUT ? Number(process.env.ACTION_TIMEOUT) : 5000,  // Timeout for individual actions (default: 5 seconds)
    navigationTimeout: process.env.NAVIGATION_TIMEOUT ? Number(process.env.NAVIGATION_TIMEOUT) : 10000,  // Timeout for page navigation (default: 10 seconds)
  },

   // Přidání hooku `afterEach` přímo sem
   afterEach: async ({}, testInfo) => {
    if (testInfo.status === 'failed') {
      console.log('Test failed, waiting before retrying...');
      await delay(5000);  // Čekání 5 sekund mezi pokusy
    }
  },
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