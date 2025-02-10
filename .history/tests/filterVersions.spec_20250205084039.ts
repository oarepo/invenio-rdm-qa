import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { HomePage } from '../pages/homePage';
import { CommunityDetail } from '../pages/communityDetailPage';
import { RecordDetail } from '../pages/recordDetailPage';

test.describe('Search and Filter', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let homePage: HomePage;
  let communityDetailPage: CommunityDetail;
  let recordDetailPage: RecordDetail;

  test.beforeEach(async ({ loggedInPage, createCommunityAndUploadFile }) => {
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

  // Test design: https://app.qase.io/case/RDM-37
  test(qase(37, 'Filter - Versions'), async () => {  

    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();
  
    // Open detail page of the first record
    await uploadPage.firstRecordDetail();
  
    // Click 'Edit' button
    console.log('Clicking the New version button...');
    await recordDetailPage.clickNewVersion2();

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Fill the publication date with today's date
    await uploadPage.waitForTwoSeconds;
    await uploadPage.fillPublicationDateWithToday();

    // Click the Publish button + confirm
    await uploadPage.clickPublish();
    await uploadPage.clickPublishOnConfirmation();

    // Navigate to the first community
    await communityDetailPage.navigateToHome();
    await communityDetailPage.navigateToCommunities();
    await communityDetailPage.navigateToFirstCommunity();

    // Verify the number of found results
    const isOnePresent = await communityDetailPage.isNumberOnePresent();
    expect(isOnePresent).toBeTruthy();
  });
});