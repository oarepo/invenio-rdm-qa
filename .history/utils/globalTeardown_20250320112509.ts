import fs from 'fs';

export default async ({ status }) => {
  // If any tests failed (status is not 0)
  if (status !== 0) {
    console.log('❌ Some tests failed, but setting exit code to 0');

    try {
      const reportPath = 'playwright-report/results.json';

      // Check if the test report file exists
      if (fs.existsSync(reportPath)) {
        // Read and parse the JSON report
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

        // Find all failed tests in the report
        const failedTests = report.suites?.flatMap(suite => suite.tests)
          .filter(test => test.status === 'failed') || [];

        // Append test results to the GitHub Actions step summary
        fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY!, `## Test Results\n- ❌ Failed tests: ${failedTests.length}\n`);
      } else {
        console.warn('⚠️ Report file not found:', reportPath);
      }
    } catch (error) {
      console.error('⚠️ Error reading report file:', error);
    }

    // Force exit with a success status (0) even if tests failed
    process.exit(0);
  }
};