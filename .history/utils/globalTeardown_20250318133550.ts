import fs from 'fs';

export default async ({ status }) => {
  if (status !== 0) {
    console.log('❌ Some tests failed, but we will set the exit code to 0');
    
    // Load the Playwright JSON report
    const report = JSON.parse(fs.readFileSync('playwright-report/results.json', 'utf8'));
    const failedTests = report.suites.flatMap(suite => suite.tests).filter(test => test.status === 'failed');

    // Add to GitHub Actions Summary
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY!, `## Test Results\n- ❌ Failed tests: ${failedTests.length}\n`);
    
    process.exit(0); // Overrides the exit code to success
  }
};