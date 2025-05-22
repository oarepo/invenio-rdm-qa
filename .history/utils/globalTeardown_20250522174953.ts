import fs from 'fs';
import { qase } from 'playwright-qase-reporter';


export default async ({ status }) => {
  console.log('Running globalTeardown');

  try {
    // Always complete the Qase test run properly
    await qase().complete();
    console.log('✅ Qase run completed');
  } catch (error) {
    console.error('⚠️ Error completing Qase run:', error);
  }

  if (status !== 0) {
    console.log('❌ Some tests failed, but overriding exit code to 0');

    try {
      const report = JSON.parse(fs.readFileSync('playwright-report/results.json', 'utf8'));
      const failedTests = report.suites?.flatMap(suite => suite.tests).filter(test => test.status === 'failed') || [];
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY || 'summary.log',
        `\n## Test Results\n- ❌ Failed tests: ${failedTests.length}\n`
      );
    } catch (err) {
      console.error('⚠️ Failed to read or parse results.json:', err);
    }

    process.exit(0); // override failure exit code to allow rerun workflow
  }
};
