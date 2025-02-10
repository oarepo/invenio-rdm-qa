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

  // Test design: https://app.qase.io/case/RDM-46
  test(qase(46, 'Citation'), async () => {

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();
  
    // Open detail page of the first record
    await uploadPage.firstRecordDetail();
    
    // Select 'Harvard' from the citation dropdown
    await recordDetailPage.selectCitationStyle('Harvard');

    // Verify the dropdown displays 'Harvard'
    const selectedStyleHarvard = await recordDetailPage.getSelectedStyle();
    expect(selectedStyleHarvard).toBe('Harvard');
   
     // Select 'APA' from the citation dropdown
     await recordDetailPage.selectCitationStyle('APA');

     // Verify the dropdown displays 'APA'
     const selectedStyleApa = await recordDetailPage.getSelectedStyle();
     expect(selectedStyleApa).toBe('APA');
  });
});