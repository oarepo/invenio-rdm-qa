import { test, expect } from '../utils/fixtures';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { RecordDetail } from '../pages/recordDetailPage';
import { CommunityDetail } from '../pages/communityDetailPage';
import { LoginPage } from '../pages/loginPage';

test.describe('Embargo', () => {
  let loginPage: LoginPage;
  let newCommunity: NewCommunity;
  let recordDetailPage: RecordDetail;
  let communityDetail: CommunityDetail;


  test.beforeEach(async ({ loggedInPage, uploadPage, createCommunityAndUploadFile }) => {
    loginPage = new LoginPage(loggedInPage);
    newCommunity = new NewCommunity(loggedInPage);
    communityDetail = new CommunityDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-26
  test(qase(26, 'Full Record Restricted'), async ({ uploadPage }) => {

    // Navigate to the 'New Community' page
    await uploadPage.waitForTwoSeconds();
    await recordDetailPage.navigateToMyDashboard();
    await recordDetailPage.firstRecordDetail();
    await recordDetailPage.clickEdit();
    await uploadPage.clickFullRecordRestrictedButton();
    await uploadPage.clickAcceptAndPublishButton();
    await uploadPage.clickConfirmationAcceptAndPublishButton();

  });
});
