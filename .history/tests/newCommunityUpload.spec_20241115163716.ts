import { test, expect } from '../utils/fixtures';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';

test.describe('New Upload', () => {
  let currentlySelectedType: string;
  let newCommunity: NewCommunity;


  test.beforeEach(async ({ loggedInPage, uploadPage }) => {
    await uploadPage.navigateToUploadSection();
    newCommunity = new NewCommunity (loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(8, 'New Community Upload '), async ({ uploadPage }) => {
    // Step 1: Navigate to the 'New Community' page and create a community

    await newCommunity.navigateToNewCommunities(); // Go to the 'New Communities' section

    // Fill in the community name and capture it
    const communityName = await newCommunity.fillCommunityName();  // Capture the dynamically created name
    await newCommunity.fillCommunityIdentifier();
    await newCommunity.clickCreateCommunity();

    // Step 2: Proceed with the record creation as normal

    // Fill in the record details
    await uploadPage.navigateToUploadSection();
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

    // Select the community using the dynamically created name
    await uploadPage.clickSelectButton(communityName);  // Use the captured community name here

    // Click the 'Publish' button + 'Submit record for review' button
    await uploadPage.clickSubmitReviewButton();

    // Click the 'Submit record for review' button
    await uploadPage.clickSubmitReviewButton();


    // Check the title of the new created record in the detail
    //const recordExists = await uploadPage.checkRecordExists();
    //expect(recordExists).toBe(true); // Assert that the record exists
  });
});
