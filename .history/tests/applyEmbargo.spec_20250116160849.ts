import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';
import { RecordDetail } from '../pages/recordDetailPage';

test.describe('Embargo', () => {
  let uploadPage: UploadPage;
  let recordDetailPage: RecordDetail;
  let currentlySelectedType: string | null = null;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage);
    recordDetailPage = new RecordDetail(loggedInPage);
   // await uploadPage.navigateToUploadSection();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-11
  test(qase(11, 'Apply Embargo'), async () => {  

    // Fill in the record details
    await uploadPage.navigateToUploadSection();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Select 'Full record' -> 'Restricted'
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickFullRecordRestrictedButton();

    // Check 'Apply an embargo' checkbox
    await uploadPage.checkEmbargoCheckbox();

    // Fill in 'Embargo until' field
    await uploadPage.setEmbargoUntilDate();

    // Fill in 'Embargo reason' field
    await uploadPage.fillEmbargoReason();

    // Click the Publish button
    await uploadPage.clickPublish();

    // Click the Publish button on the confirmation dialog
    await uploadPage.clickPublishOnConfirmation();

    // Check the title of the new created record in the detail
    const recordExists = await uploadPage.checkRecordExists();
    expect(recordExists).toBe(true);

    // Verify if the 'Embargoed' status label is present
    await uploadPage.waitForTwoSeconds();
    const accessStatusMessageVisible = await recordDetailPage.isEmbargoedLabelPresent();
    expect(accessStatusMessageVisible).toBe(true);

    // Verify if the "Embargoed" info message is present
    const accessStatusLabelVisible = await recordDetailPage.isEmbargoedStatusSectionPresent();
    expect(accessStatusLabelVisible).toBe(true);
  });
});