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
    
    // Change community name
    await uploadPage.waitForTwoSeconds();
    await communityDetail.editCommunityName();

    // Click the 'Save' button
    await communityDetail.clickSaveButton();
    
  });
});
