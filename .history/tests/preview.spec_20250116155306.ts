import { test } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;
  let currentlySelectedType: string | null = null; // Track the currently selected resource type

  test.beforeEach(async ({ loggedInPage, uploadFileForm }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
   // await uploadPage.navigateToUploadSection(); // Navigate to the upload section
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-49
  test(qase(49, 'Preview'), async () => {  

    // Navigate to 'Preview'
    await uploadPage.clickPreview();

    // Verify success message after saving in Preview
    await uploadPage.verifySaveDraftPreview();
    await uploadPage.verifySaveDraftPreviewVersions();
  });
});
