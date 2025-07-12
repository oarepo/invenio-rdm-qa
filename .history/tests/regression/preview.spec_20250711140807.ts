import { test } from '../utils/fixtures';
import { UploadPage } from '../../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Records', () => {
  let uploadPage: UploadPage;

  test.beforeEach(async ({ loggedInPage, uploadFileForm }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
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
