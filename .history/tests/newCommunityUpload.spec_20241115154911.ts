import { test, expect } from '../utils/fixtures';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('New Upload', () => {
  let currentlySelectedType: string;

  test.beforeEach(async ({ loggedInPage, uploadPage, createNewCommunity }) => {
    await uploadPage.navigateToUploadSection();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(8, 'New Community Upload '), async ({ uploadPage }) => {
    // Fill in the record details
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Click the 'Select a community' button
    await uploadPage.clickSelectCommunityButton();

    // Click 'My communities' tab 
    await uploadPage.clickMyCommunitiesTab();

    // Select a community
    await uploadPage.clickSelectButton(2);
    
    // Click the 'Publish' button
    await uploadPage.clickSubmitReviewButton();

    // Check the title of the new created record in the detail
    const recordExists = await uploadPage.checkRecordExists();
    expect(recordExists).toBe(true); // Assert that the record exists
  });
});