import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newRecordPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communityDetail: CommunityDetail;

  test.beforeEach(async ({ loggedInPage, createNewCommunity }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity(loggedInPage);
    communityDetail = new CommunityDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(2, 'Edit Community'), async () => {
    // Navigate to the 'Communities' page
    await communityDetail.navigateToCommunities();
  
    // Retrieve the original community name
    const originalCommunityName = await communityDetail.getCommunityNameText();
  
    // Edit the community name
    const editedCommunityName = `${originalCommunityName}_EDITED`;
    await communityDetail.editCommunityName(editedCommunityName);
  
    // Save the changes
    await communityDetail.clickSaveButton();
  
    // Verify the name was successfully updated using the dynamically modified name
    await communityDetail.verifyUpdatedCommunityName(editedCommunityName);
  });
  
});
