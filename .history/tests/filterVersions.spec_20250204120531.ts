import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { HomePage } from '../pages/homePage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('Search and Filter', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let homePage: HomePage;
  let communityDetailPage: CommunityDetail;

  test.beforeEach(async ({ loggedInPage, createCommunityAndUploadFile }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity (loggedInPage);
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

  });
});