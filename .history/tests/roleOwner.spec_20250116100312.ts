import { test, expect } from '../utils/fixtures';
import { testData } from '../data/testData';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { CommunityDetail } from '../pages/communityDetailPage';
import { LoginPage } from '../pages/loginPage';
import { MyDashboard } from '../pages/myDashboardPage';
import { RecordDetail } from '../pages/recordDetailPage';

test.describe('Permission and Access Control', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communityDetail: CommunityDetail;
  let loginPage: LoginPage;
  let myDashboard: MyDashboard;

  test.beforeEach(async ({ loggedInPage, createCommunityAndUploadFile }) => {
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

  // Test design: https://app.qase.io/case/RDM-30
  test(qase(30, 'Role - Manager'), async () => {  

    // Navigate to the first community and click the 'Invite...' button 
    await communityDetail.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToMembersSection();
    await communityDetail.clickInviteButton();

    // Fill in 'Member' field
    await communityDetail.fillMember();

    // Select 'Owner' role
    await communityDetail.selectRoleByIndex(4);

    // Confirm by clicking 'Invite' button
    await communityDetail.clickInviteButtonConfirmation();

    // Logout from the Invenio RDM
    await newCommunity.navigateToHome();
    await loginPage.logout();

    // Login as an owner
    const newCredentials = testData.getCredentials('owner');
    await loginPage.login(newCredentials.email, newCredentials.password);

    // Navigate to the 'Requests' (My dashboard)
    await myDashboard.navigateToMyDashboard();
    await myDashboard.navigateToRequests();
      
    // Click 'Accept' button (accept invitation to the community) - by index: 0 = first request
    await myDashboard.clickAcceptButton(0);
    await myDashboard.clickAcceptButtonConfirm();

    // Navigate to the first community and detail of the first record
    await communityDetail.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToMembersSection();

    // Change Role to the manager
    await communityDetail.selectRoleOption('Manager');

    // Verify the role was successfully set to Manager
    await communityDetail.verifySelectedRole('Manager');
  });
});
