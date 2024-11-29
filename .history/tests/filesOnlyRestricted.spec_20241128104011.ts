import { test, expect } from '../utils/fixtures';
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
    recordDetailPage = new RecordDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-27
  test(qase(27, 'Files Only Restricted'), async ({ uploadPage }) => {

    // Navigate to the edit menu of the first record within the created community
    await uploadPage.waitForTwoSeconds();
    await recordDetailPage.navigateToMyDashboard();
    await recordDetailPage.firstRecordDetail();
    await recordDetailPage.clickEdit();

    // Set the record as 'Restricted' and publish
    await uploadPage.clickFilesOnlyRestrictedButton();
    await uploadPage.clickPublish();
    await uploadPage.clickPublishOnConfirmation();

    // Verify if the 'Record Access Status' section is present (under files)
    const restrictedMessageVisible = await recordDetailPage.checkRestrictedMessagePresence();
    expect(restrictedMessageVisible).toBe(true);

    // Logout from the Invenio RDM
    await loginPage.logout();

    // Navigate to the community again and check that 'Restricted' record is not present
    await communityDetail.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();

    // Verify if the 'Restricted' record is not present
    const restrictedLabel = await communityDetail.verifyRestrictedLabel();
    expect(restrictedLabel).toBe(true);

    // Verify if the 'Restricted' record is not present
    await recordDetailPage.firstRecordDetail();
    const noRecordsFound = await communityDetail.verifyRestrictedLabel();
    expect(noRecordsFound).toBe(true);

  });
});
