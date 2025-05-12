import { test, expect } from '../../utils/fixtures';
import { testData } from '../../data/testData';
import { UploadPage } from '../../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../../pages/newCommunityPage';
import { CommunityDetail } from '../../pages/communityDetailPage';
import { LoginPage } from '../../pages/loginPage';
import { MyDashboard } from '../../pages/myDashboardPage';

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
    // Navigate home and log out
    await newCommunity.navigateToHome();
    await loginPage.logout();

    // Log in as curator
    const curatorCreds = testData.getCredentials('curator');
    await loginPage.login(curatorCreds.email, curatorCreds.password);

    // Go to Requests section
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToRequests();

    // While there is at least one "Decline" button, click and confirm
    let hasDecline = await myDashboard.isDeclineButtonPresent(0);
    while (hasDecline) {
      await myDashboard.clickDeclineButton(0);
      await myDashboard.clickDeclineButtonConfirm();
      await myDashboard.waitForTwoSeconds();
      hasDecline = await myDashboard.isDeclineButtonPresent(0);
    }

    // Verify that the requests list is empty
    const noRequest = await myDashboard.isAllDoneMessagePresent();
    expect(noRequest).toBe(true);
  });
});
