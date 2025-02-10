import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { RecordDetail } from '../pages/recordDetailPage';
import { MyDashboard } from '../pages/myDashboardPage';

test.describe('Record Landing Page', () => {
  let uploadPage: UploadPage;
  let recordDetailPage: RecordDetail;
  let myDashboard: MyDashboard;

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage, uploadFileSuccessfully }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    recordDetailPage = new RecordDetail(loggedInPage);
    myDashboard = new MyDashboard(loggedInPage);
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

  // Test design: https://app.qase.io/case/RDM-47
  test(qase(47, 'Export'), async ({ page }) => {
    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();
    
    // Open detail page of the first record
    await uploadPage.firstRecordDetail();

    // Select 'DCAT' from the 'Export' section pull down list
    await recordDetailPage.selectFileFormat('DCAT');
    await recordDetailPage.clickExportButton();

     // Wait for the download event
     const download = await page.waitForEvent('download');

     // Get the downloaded file path dynamically
     const filePath = await download.path();
     expect(filePath).not.toBeNull();
 
     // Read the file content directly from the download stream
     const fileContent = await download.createReadStream();
     let data = '';
     for await (const chunk of fileContent) {
       data += chunk;
     }
 
     // Try parsing the content as JSON and validate
     try {
       const jsonData = JSON.parse(data);
       expect(jsonData).toBeDefined(); // Ensure it's a valid object
 
       // Check for expected keys (even with random data)
       expect(jsonData).toHaveProperty('someExpectedKey');
       expect(jsonData).toHaveProperty('anotherExpectedKey');
 
       // You can check for patterns (e.g., numbers or strings)
       expect(jsonData.someExpectedKey).toMatch(/^\d+$/); // Check if it's a number
       expect(jsonData.anotherExpectedKey).toMatch(/^[a-zA-Z]+$/); // Check if it's a string
 
     } catch (error) {
       // Fail the test if the content is not valid JSON
       throw new Error('Downloaded file is not valid JSON');
     }
    
  });  
});