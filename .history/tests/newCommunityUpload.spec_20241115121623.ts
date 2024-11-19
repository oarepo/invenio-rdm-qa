import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;
  let currentlySelectedType: string | null = null;
  let newCommunity: NewCommunity;


  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity(loggedInPage);
   // await uploadPage.navigateToUploadSection();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(8, 'New Community Upload '), async () => {  

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

    // Click the 'Publish' button
    await uploadPage.clickSubmitReviewButton();



    // Check the title of the new created record in the detail
    const recordExists = await uploadPage.checkRecordExists();
    expect(recordExists).toBe(true); // Assert that the record exists

    // Optional delay for debugging
    // await uploadPage.waitForFiveSeconds(); 
  });
});
