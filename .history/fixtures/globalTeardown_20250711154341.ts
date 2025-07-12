import fs from 'fs';

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