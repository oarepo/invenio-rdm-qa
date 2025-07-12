import { test, expect } from '../../fixtures/fixtures';
import { UploadPage } from '../../pages/newUploadPage';
import { MyDashboard } from '../../pages/myDashboardPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;
  let myDashboard: MyDashboard;
  let recordTitle: string;

  test.beforeEach(async ({ loggedInPage, uploadFileForm }) => {
    uploadPage = new UploadPage(loggedInPage);
    myDashboard = new MyDashboard(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-19
  test(qase(19, 'Delete Record'), async () => {
    // Generate and fill in the record title
    recordTitle = 'Test record ' + Date.now();
    await uploadPage.fillTitle(recordTitle);

    // Save the draft
    await uploadPage.clickSaveDraft();

    // Navigate to My Dashboard and edit the first record
    await uploadPage.navigateToMyDashboard();
    await myDashboard.clickEditButton();

    // Delete the record
    await uploadPage.clickDeleteButton();
    await uploadPage.clickDeleteButtonConfirm();

    // Verify the record is no longer visible
    const recordIsAbsent = await myDashboard.verifyRecordIsAbsent(recordTitle);
    expect(recordIsAbsent).toBe(true);
  });
});