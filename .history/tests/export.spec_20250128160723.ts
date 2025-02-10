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
  test(qase(47, 'Export Formats One by One'), async ({ loggedInPage }) => {
    const page = loggedInPage;

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();

    // Open detail page of the first record
    await uploadPage.firstRecordDetail();

    // Define the formats to test (can be extended)
    const exportFormats = ['DCAT', 'JSON-LD', 'JSON', 'DataCite JSON'];

    for (const format of exportFormats) {
      console.log(`Testing export format: ${format}`);

      // Select the format from the dropdown ('Export' section)
      await recordDetailPage.selectFileFormat(format);

      // Click the 'Export' button and wait for the download
      const [download] = await Promise.all([
        page.waitForEvent('download', { timeout: 10000 }),
        recordDetailPage.clickExportButton(),
      ]);

      // Verify the download was triggered
      expect(download).toBeTruthy();
      console.log(`Download for format "${format}" triggered successfully.`);
    }
  });
});