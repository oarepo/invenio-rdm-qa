import { test, expect } from '../utils/fixtures';
import { testData } from '../data/testData';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { CommunityDetail } from '../pages/communityDetailPage';
import { LoginPage } from '../pages/loginPage';
import { MyDashboard } from '../pages/myDashboardPage';

test.describe('Communities', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communityDetail: CommunityDetail;
  let loginPage: LoginPage;
  let myDashboard: MyDashboard;

  test.beforeEach(async ({ loggedInPage, createNewCommunity }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity(loggedInPage);
    communityDetail = new CommunityDetail(loggedInPage);
    loginPage = new LoginPage(loggedInPage);
    myDashboard = new MyDashboard(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-36
  test(qase(36, 'Remove Member'), async () => {  

    // Navigate to the first community and click the 'Invite...' button 
    await communityDetail.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToMembersSection();
    await communityDetail.clickInviteButton();

    // Fill in 'Member' field
    await communityDetail.fillMember();

    // Select 'Curator' role 
    await communityDetail.selectRoleByIndex(2);

    // Confirm by clicking 'Invite' button
    await communityDetail.clickInviteButtonConfirmation();

    // Logout from the Invenio RDM
    await newCommunity.navigateToHome();
    await loginPage.logout();

    // Login as a curator
    const curatorCredentials = testData.getCredentials('curator');
    await loginPage.login(curatorCredentials.email, curatorCredentials.password);

    // Navigate to the 'Requests' (My dashboard)
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToRequests();
      
    // Click 'Accept' button (accept invitation to the community) - by index: 0 = first request
    await myDashboard.clickAcceptButton(0);
    await myDashboard.clickAcceptButtonConfirm();

    // Logout from the Invenio RDM and Login back as owner
    await newCommunity.navigateToHome();
    await loginPage.logout();
    const ownerCredentials = testData.getCredentials('owner');
    await loginPage.login(ownerCredentials.email, ownerCredentials.password);

    // Navigate to the 'Communities' page
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToCommunities();
    await myDashboard.navigateToFirstCommunity();
    await communityDetail.navigateToMembersSection();

    // Click 'Remove...' button and confirm in pop up 'Remove user' dialog
    await communityDetail.clickLeaveButton();
    await communityDetail.clickLeaveButtonByIndex(1);

    // Check if the message 'This community has no public members.' is present
    //const isMessagePresent = await communityDetail.verifyLeaveCommunity();
    //expect(isMessagePresent).toBe(true);
  });
});
