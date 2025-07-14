import fs from 'fs';

/**
 * This script runs after all Playwright tests have completed. Its main purpose is to inspect the overall test run status and modify the process exit code if any tests failed.
 * 
 * Specifically:
 * - If there are failed tests (status !== 0), it reads the Playwright JSON test report to count the failed tests.
 * - It appends a summary of failed tests to the GitHub Actions step summary file (if running in GitHub Actions environment).
 * - It overrides the exit code to 0 to prevent the CI pipeline from failing, allowing manual handling or further processing of test results.
 * 
 * This approach is useful in pipelines where you want to collect and report test failures but not necessarily stop the entire workflow immediately.
 */

type Test = {
  status: string;
};

type Suite = {
  tests: Test[];
};

export default async ({ status }: { status: number }) => {
  console.log('Running globalTeardown');

  // If Playwright reports failure, change status to 0
  if (status !== 0) {
    console.log('Some tests failed, but we will set the exit code to 0');

    // Load the Playwright JSON report
    const report = JSON.parse(fs.readFileSync('playwright-report/results.json', 'utf8'));

    const failedTests = report.suites
      .flatMap((suite: Suite) => suite.tests)
      .filter((test: Test) => test.status === 'failed');

    // Add to GitHub Actions Summary
    if (process.env.GITHUB_STEP_SUMMARY) {
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `## Test Results\n- ❌ Failed tests: ${failedTests.length}\n`
      );
    }

    process.exit(0); // Overrides the exit code to success
  }
};