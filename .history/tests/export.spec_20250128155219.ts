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
  test(qase(47, 'Export'), async ({ loggedInPage }) => {
    const page = loggedInPage;

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();

    // Open detail page of the first record
    await uploadPage.firstRecordDetail();

    // Select 'DCAT' from the 'Export' section pull-down list
    await recordDetailPage.selectFileFormat('DCAT');

    // Click 'Export' button
    await recordDetailPage.clickExportButton();

     // Wait for the download event and confirm it occurred
     const [download] = await Promise.all([
      page.waitForEvent('download', { timeout: 10000 }), // Wait for download
      recordDetailPage.clickExportButton(), // Trigger download
    ]);

    // Simple check to confirm download was triggered
    expect(download).toBeTruthy();
    console.log('Download event triggered successfully.');
  });
});