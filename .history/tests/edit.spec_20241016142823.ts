import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { testData } from '../data/testData';

test.describe('Edit record', () => {
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage, uploadFileSuccessfully }) => {
    // The user is already logged in via the `loggedInPage` fixture
    console.log('User is logged in.');

    // Now, upload a new file using the `uploadFileSuccessfully` fixture
    await uploadFileSuccessfully();
    console.log('File successfully uploaded.');
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

  test('Edit Existing Record', async ({ uploadPage }) => {
    // Navigate to dashboard and click on the first record
    await uploadPage.navigateToMyDashboard();
    await uploadPage.firstRecordDetail();

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