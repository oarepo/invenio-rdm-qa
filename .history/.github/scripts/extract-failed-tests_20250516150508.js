const fs = require('fs'); // Import the built-in 'fs' module to work with the file system

// Path to the Playwright JSON test report
const reportPath = './test-results.json';

// Check if the JSON report file exists. Exit the script if not found.
if (!fs.existsSync(reportPath)) {
  console.error('test-results.json not found');
  process.exit(1);
}

// Read the contents of the JSON report and parse it into a JavaScript object
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Create a Set to store file paths of failed test specs (avoid duplicates)
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