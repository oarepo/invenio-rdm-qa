import { test } from '../utils/fixtures';
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

  test(qase(49, 'Preview'), async () => {  

    // Fill in the record details
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true); // Adjust this based on your test needs
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Navigate to 'Preview'
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickPreview();

    // Verify success message after saving in Preview
    await uploadPage.verifySaveDraftPreview();
    await uploadPage.verifySaveDraftPreviewVersions();
  });
});
