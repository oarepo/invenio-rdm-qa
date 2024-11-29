import { test } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('Communities', () => {
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

  // Test design: https://app.qase.io/case/RDM-2
  test(qase(2, 'Edit Community'), async () => {  
    
    // Change community name
    await uploadPage.waitForTwoSeconds();
    const editedCommunityName = await communityDetail.editCommunityName();

    // Click the 'Save' button
    await communityDetail.clickSaveButton();
    
    // Verify the name was successfully updated
    await uploadPage.waitForTwoSeconds();
    await communityDetail.verifyUpdatedCommunityName(editedCommunityName);
  });
});