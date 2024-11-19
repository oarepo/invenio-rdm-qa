import { test, expect } from '../utils/fixtures';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { LoginPage } from '../pages/loginPage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('New Upload', () => {
  let newCommunity: NewCommunity;
  let loginPage: LoginPage;
  let communityDetail: CommunityDetail;

  test.beforeEach(async ({ loggedInPage, uploadPage, createCommunityAndUploadFile }) => {
    newCommunity = new NewCommunity(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(24, 'Community Visibility - Public'), async ({ uploadPage }) => {

    // Navigate to the 'Communities' page
    await uploadPage.waitForTwoSeconds();
    await newCommunity.navigateToCommunities();

    // Save the name of the first community and logout
    const firstCommunityName = await newCommunity.getFirstCommunityName();
    await loginPage.logout();

    // Navigate to the 'Communities' page and validate presence of the public community
    await newCommunity.navigateToCommunities();
    const firstCommunityNameLogout = await newCommunity.getFirstCommunityName();
    expect(firstCommunityName).toBe(firstCommunityNameLogout);

    await communityDetail.navigateToFirstCommunity();
    await communityDetail.verifyResultsFound("1 results found");





  });
});
