import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { HomePage } from '../pages/homePage';
import { CommunityDetail } from '../pages/communityDetailPage';
import { RecordDetail } from '../pages/recordDetailPage';
import { testData } from '../data/testData';

test.describe('Search and Filter', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let homePage: HomePage;
  let communityDetailPage: CommunityDetail;
  let recordDetailPage: RecordDetail;
  let currentlySelectedType: string | null = null;

  test.beforeEach(async ({ loggedInPage, createCommunityAndUploadFiles }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity (loggedInPage);
    homePage = new HomePage(loggedInPage);
    communityDetailPage = new CommunityDetail(loggedInPage);
    recordDetailPage = new RecordDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-38
  test(qase(38, 'Filter - Access Status'), async () => {  
    await communityDetailPage.navigateToCommunities();
    await communityDetailPage.navigateToFirstCommunity();

    // Verify the number of found results (3)
    const isTwoPresent = await communityDetailPage.isNumberPresent(3);
    expect(isTwoPresent).toBeTruthy();

    // Check the 'Embargoed' checkbox
    await communityDetailPage.clickEmbargoedCheckbox();


  });
});