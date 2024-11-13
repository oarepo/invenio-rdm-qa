import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;
  let currentlySelectedType: string | null = null;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage);
    await uploadPage.navigateToUploadSection();
  });

  test(qase(17, 'Metadata-only'), async () => {  

    // Fill in the record details
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);

    // Check 'Metadata-only record'checkbox
    await uploadPage.checkFirstMetadataOnlyCheckbox();

    // Click the Publish button
    await uploadPage.clickPublish();

    // Click the Publish button on the confirmation dialog
    await uploadPage.clickPublishOnConfirmation();

    // Check the title of the new created record in the detail
    const recordExists = await uploadPage.checkRecordExists();
    expect(recordExists).toBe(true); // Assert that the record exists

    // Verify if the 'Metadata-only' label is visible on the page
    await uploadPage.verifyMetadataOnlyLabel();
  });
});
