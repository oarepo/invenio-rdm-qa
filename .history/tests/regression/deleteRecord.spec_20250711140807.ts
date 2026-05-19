import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../../pages/newUploadPage';
import { MyDashboard } from '../../pages/myDashboardPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;
  let myDashboard: MyDashboard;
  let recordTitle: string;

  test.beforeEach(async ({ loggedInPage, uploadFileForm }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    myDashboard = new MyDashboard(loggedInPage); // Initialize myDashboard with the logged-in page
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-19
  test(qase(19, 'Delete Record'), async () => {  

    // Click the 'Save draft' button
    await uploadPage.clickSaveDraft();

    // Navigate to My dashboard -> Click 'Edit' button in a first record
    await uploadPage.navigateToMyDashboard();
    await myDashboard.clickEditButton();

    // Delete the record
    await uploadPage.clickDeleteButton();
    await uploadPage.clickDeleteButtonConfirm();

    // Verify the record is deleted by checking its absence on the dashboard
    const recordIsAbsent = await myDashboard.verifyRecordIsAbsent(recordTitle);
    expect(recordIsAbsent).toBe(true);
  });
});