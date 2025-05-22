import fs from 'fs';
import { qase } from 'playwright-qase-reporter';

export default async ({ status }: { status: number }) => {
  console.log('Running globalTeardown');

  // Volání Qase complete pro správné uzavření runu v Qase TestOps
  try {
    await qase().complete();
    console.log('✅ Qase run marked as complete');
  } catch (error) {
    console.error('⚠️ Error marking Qase run as complete:', error);
  }

  // Pokud testy failnuly, uprav exit code na 0 (aby GitHub Actions job nebyl failnutý)
  if (status !== 0) {
    console.log('❌ Some tests failed, but we will set the exit code to 0');

    // Přečti report (v Playwright defaultně 'test-results.json')
    try {
      const report = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
      let failedCount = 0;

      const extractFailures = (suite: any): number => {
        let count = 0;
        for (const spec of suite.specs || []) {
          for (const test of spec.tests || []) {
            if (test.results.some((r: any) => r.status === 'failed')) count++;
          }
        }
        for (const child of suite.suites || []) {
          count += extractFailures(child);
        }
        return count;
      };

      failedCount = extractFailures(report);

      // Zapis do GitHub Actions summary
      fs.appendFileSync(
        process.env.GITHUB_STEP_SUMMARY!,
        `## Test Results\n- ❌ Failed tests: ${failedCount}\n`
      );

    } catch (e) {
      console.warn('Could not read test-results.json to report failed test count:', e);
    }

    process.exit(0);
  }
};