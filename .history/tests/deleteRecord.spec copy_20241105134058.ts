import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { MyDashboard } from '../pages/myDashboardPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;
  let myDashboard: MyDashboard;
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    myDashboard = new MyDashboard(loggedInPage);
    await uploadPage.navigateToUploadSection(); // Navigate to the upload section
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(19, 'Delete Record'), async () => {  

    // Fill in the record details
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true); // Adjust this based on your test needs
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Click the 'Save draft' button
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSaveDraft();

    // Navigate to My dashboard -> First record -> Edit
    await uploadPage.navigateToMyDashboard();
    await uploadPage.firstRecordDetail();
    await myDashboard.clickEdit();

  });
});