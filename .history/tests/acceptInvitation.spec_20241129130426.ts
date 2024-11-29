import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';
import { MyDashboard } from '../pages/myDashboardPage';

test.describe('Communities', () => {
  let uploadPage: UploadPage;
  let myDashboard: MyDashboard;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage);
    myDashboard = new MyDashboard(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-16
  test(qase(16, 'Accept Invitation'), async () => {  

    // Navigate to the 'Requests' (My dashboard)
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToRequests();

    //  Click 'Accept' button (accept invitation to the community) 
    await myDashboard.clickAcceptButton(0);

  
  });
});
