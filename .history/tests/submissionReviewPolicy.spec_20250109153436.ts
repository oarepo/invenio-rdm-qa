import { test } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { CommunityDetail } from '../pages/communityDetailPage';
import { testData } from '../data/testData';

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

  // Test design: https://app.qase.io/case/RDM-18
  test(qase(18, 'Submission review policy'), async () => {  
    // Navigate to the 'Communities' -> first community
    await newCommunity.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
  
    // Navigate to the 'Settings' section -> 'Review policy' menu
    await communityDetail.navigateToSettingsSection();
    await communityDetail.navigateToReviewPolicy();
  
    // Choose 'Allow curators...' radio button
    await communityDetail.clickSubmissionReviewPolicyRadioButton(2);
  
    // Click 'Save' button
   // await communityDetail.clickSaveButtonPages();
  
    // Navigate to the 'Curation policy' section
   // await communityDetail.navigateToCurationPolicySection();
  
  });
});