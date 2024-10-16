import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { testData } from '../data/testData';
import { urls } from '../data/urls';

test.describe('Edit record', () => {
  let uploadPage: UploadPage;

/*

  // Setup: Log in and navigate to the upload page
  test.beforeAll(async ({ loggedInPage, uploadFile }) => {
    uploadPage = new UploadPage(loggedInPage);
    await uploadPage.navigateToUploadSection();
    console.log('Setup complete: Navigated to the upload section.');

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
 
*/

  test('Edit Existing Record', async ({ loginPage, page }) => {
    await page.goto('https://inveniordm.web.cern.ch/');
    await loginPage.login(testData.email, testData.password);
    await page.getByRole('link', { name: 'My dashboard' }).click();
    
    // Wait for the record list to load
    await page.waitForSelector('//a[contains(@href, "/records/")][1]', { state: 'visible' });
    await page.click('//a[contains(@href, "/records/")][1]');

    // Wait for the Edit button to be visible before clicking
    console.log('Clicking the Edit button...');
    const uploadPage = new UploadPage(page);
    await uploadPage.clickEdit();

/*

    // Fill in the record description
    const recordDescription = testData.upload.recordDescription();
    console.log(`Filling in the record description: ${recordDescription}`);
   // await uploadPage.fillDescription(recordDescription);
   
   // Locate the correct iframe element, using more specific CSS if possible
    const iframeElement = page.frameLocator('iframe[id^="tiny-react"]'); 

  // Option 1: Choose based on the position (e.g., first iframe)
    const body = iframeElement.first().locator('body#tinymce');

  // Fill the body content in the iframe
    await body.fill('This is the test content!');
*/
    // Fill in Description
    const recordDescription = testData.upload.recordDescription();
    uploadPage.fillDescription(recordDescription);



    // Wait for the resource type selector to be available
    await page.waitForSelector('select#resource-type-selector', { state: 'visible' }); // Replace with actual selector
    console.log('Selecting a random resource type...');
    await uploadPage.selectResourceType();

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