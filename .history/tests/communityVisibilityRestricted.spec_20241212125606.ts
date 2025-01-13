import { test, expect } from '../utils/fixtures';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { LoginPage } from '../pages/loginPage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('Communities', () => {
  let newCommunity: NewCommunity;
  let loginPage: LoginPage;
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

  // Test design: https://app.qase.io/case/RDM-34
  test(qase(34, 'Community Visibility - Restricted'), async ({ uploadPage }) => {

    // Navigate to the 'Communities' page
    await uploadPage.waitForTwoSeconds();
    await newCommunity.navigateToCommunities();

    // Save the name of the first community and navigate to its detail page
    const firstCommunityName = await newCommunity.getFirstCommunityName();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToSettingsSection();
    await communityDetail.navigateToPrivileges();

    // Logout from the Invenio
    await loginPage.logout();

    // Navigate to the 'Communities' page again and validate the public community
    await newCommunity.navigateToCommunities();
    const firstCommunityNameLogout = await newCommunity.getFirstCommunityName();

    // Retrieve the actual text of the community name before and after logout
    const firstCommunityNameText = await firstCommunityName.textContent();
    const firstCommunityNameLogoutText = await firstCommunityNameLogout.textContent();

    // Compare the text content directly instead of comparing the locator objects
    expect(firstCommunityNameText).toBe(firstCommunityNameLogoutText);

    // Navigate to the first community and check the record exists
    await communityDetail.navigateToFirstCommunity();
    await uploadPage.waitForTwoSeconds();
    await communityDetail.verifyDateTag();
  });
});