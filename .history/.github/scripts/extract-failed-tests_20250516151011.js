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

// Recursive function to extract failed tests from a suite
function extractFailures(suite) {
  for (const spec of suite.specs || []) {   // Iterate over each spec (test file) in the suite
    for (const test of spec.tests || []) {      // For each test case in the spec, check its results
      const hasFailed = test.results.some(result => result.status === 'failed');    // Check if any result for the test case has a 'failed' status
      if (hasFailed) {
        failedSpecs.add(spec.file);     // If test failed, add its file path to the set
      }
    }
  }
    
  // If the suite has nested suites, recursively process them
  for (const child of suite.suites || []) {
    extractFailures(child);
  }
}

extractFailures(report);

// Output each failed spec file path to the console (can be used for rerun)
for (const file of failedSpecs) {
  console.log(file);
}