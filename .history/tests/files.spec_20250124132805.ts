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

  // Test design: https://app.qase.io/case/RDM-45
  test(qase(45, 'Files'), async () => {

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();
  
    // Open detail page of the first record
    await uploadPage.firstRecordDetail();
  
    // Click the 'Download' button
    await recordDetailPage.waitForTwoSeconds();
    await recordDetailPage.clickDownload();

    // Click the 'Download all' button
    await recordDetailPage.clickDownloadAll();

    // Click the 'Preview' button
    await recordDetailPage.clickPreview();

    // Verify the presence of the preview container
    const isContainerVisible = await recordDetailPage.isPreviewContainerVisible();
    expect(isContainerVisible).toBe(true); // Assert the container is visible

    // Verify the iframe exists inside the preview container
    const isIframeVisible = await recordDetailPage.isPreviewIframeInsideContainer();
    expect(isIframeVisible).toBe(true); // Assert the iframe is visible inside the container
  });
});