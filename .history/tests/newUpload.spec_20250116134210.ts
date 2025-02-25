import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  test.beforeEach(async ({ loggedInPage, uploadPage }) => {
   // uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
   // await uploadPage.navigateToUploadSection(); // Navigate to the upload section
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-58
  test(qase(58, 'New Upload'), async () => {  

    // Fill in the record details
   // await uploadPage.fillTitle(testData.upload.recordTitle());
   // await uploadPage.fillFamilyName(testData.upload.familyName());
   // await uploadPage.selectDOIOption(true); // Adjust this based on your test needs
   // await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
   // await uploadPage.uploadRandomFile();

    // Click the Publish button
  //  await uploadPage.clickPublish();

    // Click the Publish button on the confirmation dialog
  //  await uploadPage.clickPublishOnConfirmation();

    // Check the title of the new created record in the detail
    const recordExists = await uploadPage.checkRecordExists();
    expect(recordExists).toBe(true); // Assert that the record exists

    // Optional delay for debugging
    // await uploadPage.waitForFiveSeconds(); 
  });
});
