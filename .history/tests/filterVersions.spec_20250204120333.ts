import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { Communities } from '../pages/communitiesPage';
import { HomePage } from '../pages/homePage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('Search and Filter', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communities: Communities;
  let communityName: string;
  let homePage: HomePage;
  let communityDetailPage: CommunityDetail;

  test.beforeEach(async ({ loggedInPage, createCommunityAndUploadFile, uploadFileForm }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity (loggedInPage);
    communities = new Communities(loggedInPage);
    homePage = new HomePage(loggedInPage);
    communityDetailPage = new CommunityDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-37
  test(qase(37, 'Filter - Versions'), async () => {  

    // Navigate to the first community
    await communityDetailPage.navigateToCommunities();
    await communityDetailPage.navigateToFirstCommunity();
    await communityDetailPage.navigateToRecordsSection();

    // Click the search button
    await homePage.submitSearch();

    // Select the 'Oldest' option from the 'Sort by' dropdown
    await homePage.selectSortOption("Oldest");

    // Validate the 'Sort by' was chosen correctly ('Oldest')
    const isOldestSelected = await communities.isSortOptionSelected("Oldest");
    expect(isOldestSelected).toBeTruthy();

    // Select the 'Oldest' option from the 'Sort by' dropdown
    await homePage.selectSortOption("Newest");

    // Validate the 'Sort by' was chosen correctly ('Newest')
    const isNewestSelected = await communities.isSortOptionSelected("Newest");
    expect(isNewestSelected).toBeTruthy();
    
    // Select the 'Version' option from the 'Sort by' dropdown
    await homePage.selectSortOption("Version");

    // Validate the 'Sort by' was chosen correctly ('Version')
    const isVersionSelected = await communities.isSortOptionSelected("Version");
    expect(isVersionSelected).toBeTruthy();

    // Select the 'Most viewed' option from the 'Sort by' dropdown
    await uploadPage.waitForTwoSeconds();
    await homePage.selectSortOption("Most viewed");

    // Validate the 'Sort by' was chosen correctly ('Most viewed')
    const isBestMatchSelected = await communities.isSortOptionSelected("Most viewed");
    expect(isBestMatchSelected).toBeTruthy();
  });
});