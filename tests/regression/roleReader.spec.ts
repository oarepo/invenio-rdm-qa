import { test, expect } from '../../fixtures/fixtures';
import { testData } from '../../data/testData';
import { UploadPage } from '../../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../../pages/newCommunityPage';
import { CommunityDetail } from '../../pages/communityDetailPage';
import { LoginPage } from '../../pages/loginPage';
import { MyDashboard } from '../../pages/myDashboardPage';

test.describe('Permission and Access Control', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communityDetail: CommunityDetail;
  let loginPage: LoginPage;
  let myDashboard: MyDashboard;

  test.beforeEach(async ({ loggedInPage, createCommunityAndUploadFile, inviteNewMemberSection }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity(loggedInPage);
    communityDetail = new CommunityDetail(loggedInPage);
    loginPage = new LoginPage(loggedInPage);
    myDashboard = new MyDashboard(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-28
  test(qase(28, 'Role - Reader'), async () => {  

    // Fill in 'Member' field
    await communityDetail.fillMember();

    // Select 'Reader' role
    await communityDetail.selectRoleByIndex(1);

    // Confirm by clicking 'Invite' button
    await communityDetail.clickInviteButtonConfirmation();

    // Logout from the Invenio RDM
    await newCommunity.navigateToHome();
    await loginPage.logout();

    // Login as a reader
    const newCredentials = testData.getCredentials('reader');
    await loginPage.login(newCredentials.email, newCredentials.password);

    // Navigate to the 'Requests' (My dashboard)
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToRequests();
      
    // Click 'Accept' button (accept invitation to the community) - by index: 0 = first request
    await myDashboard.clickAcceptButton(0);
    await myDashboard.clickAcceptButtonConfirm();

    // Navigate to the first community and detail of the first record
    await communityDetail.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToFirstRecord();

    // Verify the management menu is not present on the page
    const isNotPresent = await communityDetail.verifyRecordManagementNotPresent();
    expect(isNotPresent).toBe(true);
  });
});
