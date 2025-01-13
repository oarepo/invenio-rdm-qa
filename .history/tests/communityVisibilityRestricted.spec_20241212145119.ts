import { test, expect } from '../utils/fixtures';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { LoginPage } from '../pages/loginPage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('Communities', () => {
  let newCommunity: NewCommunity;
  let loginPage: LoginPage;
  let communityDetail: CommunityDetail;

  test.beforeEach(async ({ loggedInPage, createNewCommunity }) => {
    loginPage = new LoginPage(loggedInPage);
    newCommunity = new NewCommunity(loggedInPage);
    communityDetail = new CommunityDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-34
  test(qase(34, 'Community Visibility - Restricted'), async ({ uploadPage }) => {

    // Navigate to the 'Communities' page
    await uploadPage.waitForTwoSeconds();
    await newCommunity.navigateToCommunities();

    // Save the name of the first community and navigate to its detail page -> Settings -> Privileges
    const firstCommunityName = await newCommunity.getFirstCommunityName();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToSettingsSection();
    await communityDetail.navigateToPrivileges();

    // Check 'Restricted' radio button ('Community visibility')
    await uploadPage.waitForTwoSeconds();
    await communityDetail.clickRestrictedRadioButton(2);
    await communityDetail.clickSaveButtonPrivileges();

    // Logout from the Invenio
    await loginPage.logout();

    // Navigate to the 'Communities' page again and validate the public community
    await newCommunity.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();

    // Retrieve the community header name
    const communityHeaderName = await communityDetail.getCommunityHeaderName();

    // Compare the header name with the first community name
    expect(communityHeaderName).toBe(firstCommunityName);
  });
});