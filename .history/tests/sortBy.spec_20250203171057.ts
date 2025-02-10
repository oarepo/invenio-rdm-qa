import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { Communities } from '../pages/communitiesPage';
import { HomePage } from '../pages/homePage';

test.describe('Search and Filter', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communities: Communities;
  let communityName: string;
  let homePage: HomePage;

  test.beforeEach(async ({ loggedInPage, createCommunityAndUploadFile }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity (loggedInPage);
    communities = new Communities(loggedInPage);
    homePage = new HomePage(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-50
  test(qase(50, 'Communities - Search'), async () => {  

    // Navigate to home page
    await homePage.navigateToHome();

    // Click the search button
    await homePage.submitSearch();

    // Verify the community name
    await communities.verifyCommunityName(communityName, 0);

    // Select the 'Oldest' option from the 'Sort by' dropdown
    await communities.selectSortOption("Oldest");

    // Validate the 'Sort by' was chosen correctly
    const isOldestSelected = await communities.isSortOptionSelected("Oldest");
    expect(isOldestSelected).toBeTruthy();
  });
});
