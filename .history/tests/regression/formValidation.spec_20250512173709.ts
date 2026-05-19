import { test } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    await uploadPage.navigateToUploadSection(); // Navigate to the upload section
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-22
  test(qase(22, 'Form Validation'), async () => {  

    // Upload a file
    await uploadPage.uploadRandomFile();
    
    // Click the 'Publish' button
    await uploadPage.clickPublish();
    await uploadPage.clickPublishOnConfirmation();

    // Verify validation error messages are displayed
    await uploadPage.verifyValidationErrors();
  });
});