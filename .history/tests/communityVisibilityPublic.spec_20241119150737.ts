import { test, expect } from '../utils/fixtures';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { LoginPage } from '../pages/loginPage';

test.describe('New Upload', () => {
  let newCommunity: NewCommunity;
  let loginPage: LoginPage;

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
    const firstCommunityNameLocator = await newCommunity.getFirstCommunityName();
    await loginPage.logout();

    // Navigate to the 'Communities' page
    await newCommunity.navigateToCommunities();




  });
});
