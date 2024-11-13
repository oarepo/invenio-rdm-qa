import { test } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { qase } from 'playwright-qase-reporter';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    await uploadPage.navigateToUploadSection(); // Navigate to the upload section
  });

  test(qase(22, 'Form Validation'), async () => {  

    // Upload a file
    await uploadPage.uploadRandomFile();
    
    // Click the Publish button
    await uploadPage.clickPublish();
    await uploadPage.clickPublishOnConfirmation();

    // Verify validation error messages are displayed
    await uploadPage.verifyValidationErrors();
  });
});