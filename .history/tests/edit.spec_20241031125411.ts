import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('Edit record', () => {
  let uploadPage: UploadPage;
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage, uploadFileSuccessfully }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page

    // Uncomment the following line if you want to upload a file before each test
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

  test(qase(57, 'Edit Existing Record'), async () => {  
    const qaseData = {
      case_id: 57,
      severity: 'major',  // Explicit string value for severity
      priority: 'high',   // Explicit string value for priority
      description: 'description test',    // Set empty string to avoid null values
      preconditions: 'this is a precondition parameter',  // Set empty string to avoid null values
      postconditions: 'this is a postcondition parameter',  // Set empty string to avoid null values
      duration: 0, // Duration to be set after execution
      status: 'blocked',  // Initial status to be updated at runtime
      environment: { browser: 'Chrome', resolution: '1920x1080' },
      attachments: [],  // To store paths of any failure screenshots
      automated: true,  // Marks as automated test
      tags: ['E2E', 'UI'],  // Tags for categorization
    };

    // Debug log to check the data being sent to Qase
    console.log("Qase Payload:", JSON.stringify(qaseData));

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