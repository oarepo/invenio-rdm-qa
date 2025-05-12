import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage, uploadFileSuccessfully }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
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

  // Test design: https://app.qase.io/case/RDM-57
  test(qase(57, 'Edit Record'), async () => {  

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();
  
    // Open detail page of the first record
    await uploadPage.firstRecordDetail();
  
    // Click 'Edit' button
    console.log('Clicking the Edit button...');
    await uploadPage.clickEdit();
  
    // Fill in 'Description'
    const recordDescription = testData.upload.recordDescription();
    console.log(`Filling in record description: ${recordDescription}`);
    await uploadPage.fillDescription(recordDescription);
  
    // Change 'Resource type' with fallback value
    currentlySelectedType = currentlySelectedType || 'defaultType';
    console.log(`Selecting resource type: ${currentlySelectedType}`);
    await uploadPage.changeResourceType(currentlySelectedType);
  
    // Edit the record 'Title'
    const recordTitleEdit = testData.upload.recordTitle();
    console.log(`Editing the record title: ${recordTitleEdit}`);
    await uploadPage.fillTitle(recordTitleEdit);
  
    // Click the 'Publish' button
    console.log('Clicking the Publish button...');
    await uploadPage.clickPublish();
  
    // Confirm the dialog by clicking 'Publish' button 
    console.log('Confirming the Publish action...');
    await uploadPage.clickPublishOnConfirmation();
  
    // Wait for the record verification after editing
    console.log('Verifying record existence after edit...');
    const recordExists = await uploadPage.checkRecordExists();  // Check if the record exists
    expect(recordExists).toBe(true);  // Assert that the record exists

    // Verify the edited values are correct
    console.log('Verifying edited record details...');
    const actualDescription = await uploadPage.getRecordDescription();
    const actualTitle = await uploadPage.getRecordTitle();
  
    // Assert that the edited description and title are correct
    expect(actualDescription).toBe(recordDescription);
    expect(actualTitle).toBe(recordTitleEdit);
  
    console.log(`Record verification completed. Expected: true, Actual: ${recordExists}`);
  });
});