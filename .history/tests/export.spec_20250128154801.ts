import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { RecordDetail } from '../pages/recordDetailPage';
import { MyDashboard } from '../pages/myDashboardPage';

test.describe('Record Landing Page', () => {
  let uploadPage: UploadPage;
  let recordDetailPage: RecordDetail;
  let myDashboard: MyDashboard;

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage, uploadFileSuccessfully }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    recordDetailPage = new RecordDetail(loggedInPage);
    myDashboard = new MyDashboard(loggedInPage);
  });

  // Teardown: Take a screenshot on failure
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
      console.log(`Teardown complete: Screenshot taken for failed test - ${testInfo.title}.`);
    } else {
      console.log(`Teardown complete: Test ${testInfo.title} passed.`);
    }
  });

  // Test design: https://app.qase.io/case/RDM-47
  test(qase(47, 'Export'), async ({ browser }) => {
    // Create a new browser context to handle downloads
    const context = await browser.newContext({
      acceptDownloads: true, // Enable file downloads
    });

    const page = await context.newPage();

    // Initialize page objects
    uploadPage = new UploadPage(page);
    recordDetailPage = new RecordDetail(page);

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();

    // Open detail page of the first record
    await uploadPage.firstRecordDetail();

    // Select 'DCAT' from the 'Export' section pull-down list
    await recordDetailPage.selectFileFormat('DCAT');

    // Click 'Export' button
    await recordDetailPage.clickExportButton();

    // Wait for the download event
    const download = await page.waitForEvent('download', { timeout: 10000 });

    // Simple check to confirm the download happened
    expect(download).toBeTruthy(); // Ensure the event occurred
    console.log('Download event triggered successfully.');
  });
});