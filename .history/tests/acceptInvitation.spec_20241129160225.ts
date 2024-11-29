import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
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
  
    // Save invitation text from a request
    const extractedText = await myDashboard.saveInvitationTextInQuotes(0);
    if (extractedText === null) {
      throw new Error('Failed to extract the invitation text within quotes.');
    }
    console.log('Extracted invitation text:', extractedText);
  
    // Click 'Accept' button (accept invitation to the community) - by index: 0 = first request
    await myDashboard.clickAcceptButton(0);
    await myDashboard.clickAcceptButtonConfirm();
  
    // Navigate to the 'Communities' page
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToCommunities();
    await myDashboard.waitForTwoSeconds();
  
    // Compare the community label with the extracted invitation text
    const isLabelMatching = await myDashboard.compareCommunityLabelWithInvitation(1);
  
    expect(isLabelMatching).toBe(true); // Assert that the community label matches the invitation text
  
    if (isLabelMatching) {
      console.log('Test Passed: The community label matches the invitation text.');
    } else {
      console.error('Test Failed: The community label does not match the invitation text.');
    }
  });
});


