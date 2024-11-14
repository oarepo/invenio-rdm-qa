import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
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

  test(qase(5, 'Delete Community'), async () => {  
    
    // Change community name
    await uploadPage.waitForTwoSeconds();
    const editedCommunityName = await communityDetail.editCommunityName();
    await communityDetail.clickSaveButton();

    // Click the 'Delete community' button
    await uploadPage.waitForTwoSeconds();
    await communityDetail.clickDeleteCommunityButton();

    // Check delete members checkbox
    await communityDetail.clickMembersConfirmCheckbox();
    
    // Check delete records checkbox
    await communityDetail.clickRecordsConfirmCheckbox();
    
    // Check delete identifier checkbox
    await communityDetail.clickSlugConfirmCheckbox();

    // Fill the delete confirmation input with the edited community name
    await communityDetail.fillDeleteConfirmationInput();

    // Click the 'Permanently delete' button
    await communityDetail.clickPermanentlyDeleteButton();

    // Call this after deleting the community
    await communityDetail.navigateToCommunities();
    await communityDetail.verifyCommunityNotPresent(editedCommunityName);
  });
});
