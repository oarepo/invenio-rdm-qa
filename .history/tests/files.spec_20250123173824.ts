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

  // Test design: https://app.qase.io/case/RDM-45
  test(qase(45, 'Files'), async () => {

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();
  
    // Open detail page of the first record
    await uploadPage.firstRecordDetail();
  
    // Click 'Edit' button
    console.log('Clicking the New version button...');
    await recordDetailPage.clickNewVersion2();

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Fill the publication date with today's date
    await uploadPage.waitForTwoSeconds;
    await uploadPage.fillPublicationDateWithToday();

    // Click the Publish button + confirm
    await uploadPage.clickPublish();
    await uploadPage.clickPublishOnConfirmation();
    await uploadPage.waitForTwoSeconds();

    const recordTitle = await recordDetailPage.getRecordTitle();

    // Navigate to 'My dashboard' and turn on 'View all versions' toggle button
    await uploadPage.navigateToMyDashboard();
    await myDashboard.clickVersionsToggle();
    await myDashboard.waitForTwoSeconds();

    // Check if the new version is present in the list
    const isMatching = await myDashboard.isRecordTitleMatching(recordTitle);
    expect(isMatching).toBeTruthy();

    // Navigate to the first record
    await uploadPage.firstRecordDetail();

    // Call the method to check if 'Version v2' is present
    const isV2Present = await recordDetailPage.isVersionV2Present();
    expect(isV2Present).toBeTruthy();

    // Navigate to the record version 1 
    await recordDetailPage.clickVersionV1();

    // Call the method to check if 'Version v1' label is present
    const isV1Present = await recordDetailPage.isVersionV1Present();
    expect(isV1Present).toBeTruthy();
  });
});