import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-25
  test(qase(25, 'Bulk File Upload'), async () => {

    const fileCount = 7; // Change this number to upload more or fewer files
    const currentlySelectedType = testData.upload.resourceType(null);
    
    // Fill in the form (Title, Creator, DOI, Resource Type)
    await uploadPage.navigateToUploadSection();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload multiple files
    for (let i = 0; i < fileCount; i++) {
      await uploadPage.uploadRandomFile();
      await uploadPage.waitForTwoSeconds();
      await uploadPage.closeModalDialogWithEscIfAppears();
    }

    // Publish the record
    await uploadPage.clickPublish();
    await uploadPage.clickPublishOnConfirmation();
    await uploadPage.waitForUploadedFilesTable();

    // Check if there are at least 3 uploaded files
    const uploadedFileCount = await uploadPage.countUploadedFiles();
    expect(uploadedFileCount).toBeGreaterThanOrEqual(3); // Expect at least 3 files
  });
});