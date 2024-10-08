import { test, expect } from '../utils/baseTest';
import { UploadPage } from '../pages/uploadPage';
import { testData } from '../data/testData';

test.describe('Invenio RDM Upload Tests', () => {
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

  test('Upload a file successfully', async () => {
    // Fill in the record details
    await uploadPage.fillTitle(testData.upload.recordTitle());
   // await uploadPage.fillDescription(testData.upload.recordDescription());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(false); // Adjust this based on your test needs
    await uploadPage.selectResourceType(testData.upload.resourceType());

    // Upload a file (update this method call based on your UploadPage)
    await uploadPage.uploadFile(testData.upload.filePath); // Make sure filePath is defined in testData

    // Click the Publish button
    await uploadPage.clickPublish();

    // Verify the success message
    await uploadPage.verifySuccessMessage(testData.upload.successMessage);
  });
});