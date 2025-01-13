import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    await uploadPage.navigateToUploadSection(); // Navigate to the upload section
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-23
  test(qase(23, 'Share'), async () => {  

    // Fill in the record details
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Click the 'Share' button
    await uploadPage.clickShare();

    // Click the 'Add people' button
    await uploadPage.clickAddPeopleButton();

    // Add a user (fill in 'User' field)
    await uploadPage.fillUser();

    // Verify if the user was added
    const isPresent = await uploadPage.verifyAddedUserForShare();
    expect(isPresent).toBe(true);

    // Select 'Can edit' radio button ('Access' section)


    // Click the Publish button on the confirmation dialog

    // Optional delay for debugging
    // await uploadPage.waitForFiveSeconds(); 
  });
});
