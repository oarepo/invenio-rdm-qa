import { test, expect } from '../utils/fixtures';
import { testData } from '../data/testData';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { CommunityDetail } from '../pages/communityDetailPage';
import { LoginPage } from '../pages/loginPage';
import { MyDashboard } from '../pages/myDashboardPage';

test.describe('Communities', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communityDetail: CommunityDetail;
  let loginPage: LoginPage;
  let myDashboard: MyDashboard;

  test.beforeEach(async ({ loggedInPage, createNewCommunity, inviteNewMemberToCommunity }) => {
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

  // Test design: https://app.qase.io/case/RDM-15
  test(qase(15, 'Cancel Invitation'), async () => {  

    // Logout from the Invenio RDM
    await newCommunity.navigateToHome();
    await loginPage.logout();

    // Login as a curator
    const newCredentials = testData.getCredentials('curator');
    await loginPage.login(newCredentials.email, newCredentials.password);

    // Navigate to the 'Requests' (My dashboard)
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToRequests();
  
    // Click 'Decline' button (decline invitation to the community) - by index: 0 = first request
    await myDashboard.clickDeclineButton(0);
    await myDashboard.clickDeclineButtonConfirm();
    await myDashboard.waitForTwoSeconds();

    // Check if requests are empty
    const noRequest = await myDashboard.isAllDoneMessagePresent();
    expect(noRequest).toBe(true);
  });
});