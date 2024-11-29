import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { MyDashboard } from '../pages/myDashboardPage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('Communities', () => {
  let uploadPage: UploadPage;
  let myDashboard: MyDashboard;
  let communityDetail: CommunityDetail;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage);
    myDashboard = new MyDashboard(loggedInPage);
    communityDetail = new CommunityDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-16
  test(qase(16, 'Accept Invitation'), async () => {  
    // Navigate to the 'Requests' (My dashboard)
   // await myDashboard.navigateToMyDashboard();
   // await myDashboard.navigateToRequests();
  
    // Click 'Accept' button (accept invitation to the community) - by index: 0 = first request
   // await myDashboard.clickAcceptButton(0);
   // await myDashboard.clickAcceptButtonConfirm();
  
    // Navigate to the 'Communities' page
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToCommunities();
    await myDashboard.navigateToFirstCommunity();
    await communityDetail.navigateToMembersSection();

    // Check if the 'You' label is present
    const isYouLabelVisible = await communityDetail.isYouLabelPresent();
    expect(isYouLabelVisible).toBe(true);
  });
});


