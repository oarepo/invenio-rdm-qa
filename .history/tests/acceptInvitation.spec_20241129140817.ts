import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';
import { MyDashboard } from '../pages/myDashboardPage';
import { match } from 'assert';

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

    const extractedText = await myDashboard.saveInvitationTextInQuotes(1);
    if (extractedText === null) {
      throw new Error('Failed to extract the invitation text within quotes.');
    }
    console.log('Extracted invitation text:', extractedText);
    //  Click 'Accept' button (accept invitation to the community) - by index: 0 = first request
    await myDashboard.clickAcceptButton(0);
    await myDashboard.clickAcceptButtonConfirm();

    await myDashboard.navigateToCommunities();

    const isPresent = await myDashboard.isInvitationTextPresentOnPage(extractedText);
    expect(isPresent).toBe(true);
    
    if (isPresent) {
      console.log('Test Passed: The invitation text is present on the page.');
    } else {
      console.error('Test Failed: The invitation text is not present on the page.');
    }
  
  });
});
