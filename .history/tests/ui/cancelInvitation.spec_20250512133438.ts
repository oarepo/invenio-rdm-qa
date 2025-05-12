import { test, expect } from '../../utils/fixtures';
import { testData } from '../../data/testData';
import { NewCommunity } from '../../pages/newCommunityPage';
import { LoginPage } from '../../pages/loginPage';
import { MyDashboard } from '../../pages/myDashboardPage';
import { qase } from 'playwright-qase-reporter';

test.describe('Communities', () => {
  let newCommunity: NewCommunity;
  let loginPage: LoginPage;
  let myDashboard: MyDashboard;

  test.beforeEach(async ({ loggedInPage, createNewCommunity, inviteNewMemberToCommunity }) => {
    newCommunity = new NewCommunity(loggedInPage);
    loginPage   = new LoginPage(loggedInPage);
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

    // Loop until there are no more "Decline" buttons
    let remaining = await myDashboard.getDeclineButtonsCount();
    while (remaining > 0) {
      await myDashboard.clickDeclineButton(0);
      await myDashboard.clickDeclineButtonConfirm();
      await myDashboard.waitForTwoSeconds();
      remaining = await myDashboard.getDeclineButtonsCount();
    }

    // Final assertion: zero decline buttons
    expect(await myDashboard.getDeclineButtonsCount()).toBe(0);
  });
});