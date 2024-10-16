import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { testData } from '../data/testData';
import { urls } from '../data/urls';

test.describe('Edit record', () => {
  let uploadPage: UploadPage;
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  // Setup: Log in and navigate to the upload page
  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    await uploadPage.navigateToUploadSection(); // Navigate to the upload section
  });

    // Call the uploadFile fixture to handle the file upload
    await uploadFile(); // Use the helper to upload a random file
    console.log('Initial file upload complete.');
  });
  
  // Teardown: Take a screenshot on failure
  test.afterAll(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
      console.log(`Teardown complete: Screenshot taken for failed test - ${testInfo.title}.`);
    } else {
      console.log(`Teardown complete: Test ${testInfo.title} passed.`);
    }
  });
 


  test('Edit Existing Record', async ({ loginPage, page }) => {
    await page.goto('https://inveniordm.web.cern.ch/');
    await loginPage.login(testData.email, testData.password);
    await page.getByRole('link', { name: 'My dashboard' }).click();
    
    // Navigate to the first record detail
    await page.waitForSelector('//a[contains(@href, "/records/")][1]', { state: 'visible' });
    await page.click('//a[contains(@href, "/records/")][1]');

    // Click Edit button
    console.log('Clicking the Edit button...');
    const uploadPage = new UploadPage(page);
    await uploadPage.clickEdit();

    // Fill in Description
    const recordDescription = testData.upload.recordDescription();
    uploadPage.fillDescription(recordDescription);

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
    const recordTitle = testData.upload.recordTitle(); // Get the expected record title
    const recordExists = await uploadPage.checkRecordExists(); // Check if the record exists

    // Assert that the record exists
    expect(recordExists).toBe(true);
    console.log(`Record verification completed. Expected: true, Actual: ${recordExists}`);
  });
});