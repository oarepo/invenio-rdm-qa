import { test } from '../utils/fixtures';
import { testData } from '../data/testData';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { CommunityDetail } from '../pages/communityDetailPage';

test.describe('Communities', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communityDetail: CommunityDetail;

  test.beforeEach(async ({ loggedInPage, createNewCommunity }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity(loggedInPage);
    communityDetail = new CommunityDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-35
  test(qase(35, 'Leave Community'), async () => {  

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

    // Navigate to the first community and go to 'Members' -> 'Invitations' 
    await communityDetail.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToMembersSection();
    await communityDetail.clickInvitationsSection();

    // Check if the invited member is present in the list using the email from testData
    const isMemberPresent = await communityDetail.verifyCommunityMemberIsPresent(testData.existingUserEmail);
    console.log(`Is the member present? ${isMemberPresent}`);
  });
});
