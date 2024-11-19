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

  test(qase(9, 'Accept and Publish Request'), async ({ uploadPage }) => {
    
    // Navigate to the 'New Community' page
    await newCommunity.navigateToNewCommunities();

    // Fill in the community name and capture it
    const communityName = await newCommunity.fillCommunityName();  // Capture the dynamically created name
    await newCommunity.fillCommunityIdentifier();
    await newCommunity.clickCreateCommunity();

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
    await uploadPage.clickSelectButton(communityName);

    // Click the 'Publish' button
    await uploadPage.clickSubmitReviewButton();

    // Check confirmation checkboxes ('Submit for review' pop-up dialog)
    await uploadPage.clickAcceptAccessToRecord();
    await uploadPage.clickAcceptPublishRecord();

    // Click the 'Submit record for review' button
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButtonConfirm();

    // Check the status ('Submitted') of the new created record in the detail
    await uploadPage.waitForTwoSeconds();
    const isSubmittedVisible = await uploadPage.verifySubmittedStatusPresence();
    expect(isSubmittedVisible).toBe(true);

    // Navigate to the 'New Community' page
    await newCommunity.navigateToCommunities();

    // Click the 'Accept and publish' button
    await uploadPage.clickAcceptAndPublishButton();
    await uploadPage.clickConfirmationAcceptAndPublishButton();

    // Check the status ('Accepted') of the new created record in the detail
    await uploadPage.waitForTwoSeconds();
    const isConfirmationVisible = await uploadPage.verifyConfirmationStatusPresence();
    expect(isConfirmationVisible).toBe(true);
  });
});
