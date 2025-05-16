const fs = require('fs'); // Import the built-in 'fs' module to work with the file system

// Path to the Playwright JSON test report
const reportPath = './test-results.json';

// Check if the JSON report file exists; exit the script if not found
if (!fs.existsSync(reportPath)) {
  console.error('test-results.json not found');
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

const failedSpecs = new Set();

function extractFailures(suite) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      const hasFailed = test.results.some(result => result.status === 'failed');
      if (hasFailed) {
        failedSpecs.add(spec.file);
      }
    }
  }

  for (const child of suite.suites || []) {
    extractFailures(child);
  }
}

extractFailures(report);

for (const file of failedSpecs) {
  console.log(file);
}