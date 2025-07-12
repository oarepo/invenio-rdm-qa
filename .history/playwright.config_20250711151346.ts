import { defineConfig, devices } from '@playwright/test';
import { appConfig } from './config/env';
import { timeouts } from './config/timeouts';

// Log important environment variables for debugging purposes -> results to Qase
console.log("QASE_TESTOPS_API_TOKEN:", appConfig.qaseToken);
console.log("QASE_TESTOPS_PROJECT:", appConfig.qaseProject);

export default defineConfig({
  testDir: './tests',  // Directory where tests are located
  fullyParallel: true,  // Enable running tests fully in parallel
  forbidOnly: !!process.env.CI,  // Prevent .only in CI to avoid accidentally skipping tests
  retries: process.env.CI ? 2 : 0,  // Retry failed tests twice in CI, no retries locally
  workers: process.env.CI ? 1 : undefined,  // Limit to 1 worker in CI to reduce load, use default locally

  timeout: timeouts.testTimeout, // Global timeout per test (default: 120 seconds)

  reporter: [
    ['list'],  // Terminal list reporter for test results
    // ['json', { outputFile: 'playwright-report/results.json' }], // Optional JSON report for CI processing
    ['playwright-qase-reporter', {
      debug: true,  // Enable debug mode in Qase reporter
      testops: {
        api: {
          token: appConfig.qaseToken,  // Qase API token for integration
        },
        project: appConfig.qaseProject,  // Qase project identifier
        environment: appConfig.qaseEnvironment,  // Test environment name in Qase (dev/test/prod)
        uploadAttachments: true,  // Upload screenshots/videos on failure
        run: {
          complete: true,  // Mark test run as complete in Qase
        },
      },
      logging: true,  // Enable detailed logging for Qase reporter
    }],
    ['html'],  // Generate HTML report after tests complete
  ],

  use: {
    headless: process.env.CI ? true : process.env.HEADLESS !== 'false',  // Run headless in CI, locally configurable via HEADLESS env
    trace: process.env.CI ? 'on-first-retry' : 'off',  // Enable trace only on first retry in CI for debugging failures
    video: process.env.RECORD_VIDEO === 'true' ? 'on' : 'retain-on-failure',  // Record video always or only on failure based on env
    screenshot: 'only-on-failure',  // Take screenshots only when test fails
    ignoreHTTPSErrors: true,  // Ignore HTTPS errors in tests (useful for self-signed certs)

    // Timeouts for Playwright actions and navigation, customizable by environment variables
    actionTimeout: timeouts.actionTimeout,
    navigationTimeout: timeouts.navigationTimeout,

    baseURL: appConfig.baseURL,  // Base URL for all tests (set via env)
  },

  projects: [
    {
      name: 'chromium',  // Test project for Chromium browser
      use: { ...devices['Desktop Chrome'] },  // Use Desktop Chrome device emulation
    },
    // You can add more projects here for Firefox, WebKit, mobile devices, etc.
  ],
});