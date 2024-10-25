import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('New Upload', () => {
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

  test(qase(7, 'Upload a file successfully'), async () => {  
    // Qase test case ID: 7
    const qaseData = {
      case_id: 7,
      severity: 'major',  // Explicit string value for severity
      priority: 'high',   // Explicit string value for priority
      description: '',    // Set empty string to avoid null values
      preconditions: '',  // Set empty string to avoid null values
      postconditions: ''  // Set empty string to avoid null values
    };

    // Debug log to check the data being sent to Qase
    console.log("Qase Payload:", JSON.stringify(qaseData));

    // Fill in the record details
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true); // Adjust this based on your test needs
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Click the Publish button
    await uploadPage.clickPublish();

    // Click the Publish button on the confirmation dialog
    await uploadPage.clickPublishOnConfirmation();

    // Check the title of the new created record in the detail
    const recordExists = await uploadPage.checkRecordExists();
    expect(recordExists).toBe(true); // Assert that the record exists

    // Optional delay for debugging
    // await uploadPage.waitForFiveSeconds(); 
  });
});
