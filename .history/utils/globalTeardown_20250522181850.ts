import fs from 'fs';
import { qase } from 'playwright-qase-reporter';

export default async ({ status }) => {
  console.log('Running globalTeardown');

  try {
    await qase().complete();
    console.log('Qase run completed');
  } catch (error) {
    console.error('⚠️ Error completing Qase run:', error);
  }

  if (status !== 0) {
    console.log('Some tests failed, rerunning failed tests');

    try {
      const report = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));
      const failedTests = report.suites?.flatMap(suite => suite.specs || [])
        .filter(spec => spec.tests.some(test => test.results.some(result => result.status === 'failed')))
        .map(spec => spec.file) || [];

      if (failedTests.length > 0) {
        console.log('Retrying failed tests:', failedTests);
        await Promise.all(failedTests.map(test => {
          return new Promise<void>((resolve, reject) => {
            require('child_process').exec(`npx playwright test ${test}`, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing test ${test}: ${stderr}`);
                reject(error);
              } else {
                console.log(`Test ${test} completed`);
                resolve();
              }
            });
          });
        }));
      } else {
        console.log('No failed tests to retry.');
      }
    } catch (err) {
      console.error('⚠️ Failed to read or parse test-results.json:', err);
    }
  }
};
