import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { RecordDetail } from '../pages/recordDetailPage';

test.describe('Record Landing Page', () => {
  let uploadPage: UploadPage;
  let recordDetailPage: RecordDetail;

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage, uploadFileSuccessfully }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    recordDetailPage = new RecordDetail(loggedInPage);
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

  // Test design: https://app.qase.io/case/RDM-44
  test(qase(44, 'Versions'), async () => {

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();
  
    // Open detail page of the first record
    await uploadPage.firstRecordDetail();
  
    // Click 'Edit' button
    console.log('Clicking the New version button...');
    await recordDetailPage.clickNewVersion2();

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Fill the publication date with today's date
    await uploadPage.waitForTwoSeconds;
    await uploadPage.fillPublicationDateWithToday();

    // Click the Publish button + confirm
    await uploadPage.clickPublish();
    await uploadPage.clickPublishOnConfirmation();

  });
});