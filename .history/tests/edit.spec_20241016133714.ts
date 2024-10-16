import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { LoginPage } from '../pages/loginPage'; 
import { testData } from '../data/testData';

test.describe('Edit record', () => {
  let uploadPage: UploadPage;
  let loginPage: LoginPage;
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page

    // Upload a random file
   // await uploadFileSuccessfully();
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

  test('Edit Existing Record', async () => {

   // Wait for the first record to appear and click on it
   // console.log('Navigating to the first record...');
   // await uploadPage.page.waitForSelector('//a[contains(@href, "/records/")][1]', { state: 'visible' });
   // await uploadPage.page.click('//a[contains(@href, "/records/")][1]');

    await uploadPage.navigateToMyDashboard();

    // Click Edit button
    console.log('Clicking the Edit button...');
    await uploadPage.clickEdit();

    // Fill in Description
    const recordDescription = testData.upload.recordDescription();
    await uploadPage.fillDescription(recordDescription);

    // Change Resource type with fallback value
    currentlySelectedType = currentlySelectedType || 'defaultType';
    console.log('Selecting a random resource type...');
    await uploadPage.changeResourceType(currentlySelectedType);

      // Change Resource type
      console.log('Selecting a random resource type...');
      await uploadPage.changeResourceType(currentlySelectedType);

    // Edit the record title
    const recordTitleEdit = testData.upload.recordTitle();
    console.log(`Editing the record title: ${recordTitleEdit}`);
    await uploadPage.fillTitle(recordTitleEdit);

    // Click the Publish button
    console.log('Clicking the Publish button...');
    await uploadPage.clickPublish();

    // Confirm the Publish action
    console.log('Confirming the Publish action...');
    await uploadPage.clickPublishOnConfirmation();

    // Wait for the record verification after editing
    console.log('Verifying record existence after edit...');
    const recordExists = await uploadPage.checkRecordExists(); // Check if the record exists

    // Assert that the record exists
    expect(recordExists).toBe(true);
    console.log(`Record verification completed. Expected: true, Actual: ${recordExists}`);
  });
});