import { test } from '../utils/fixtures';
import { UploadPage } from '../../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../../pages/newCommunityPage';
import { CommunityDetail } from '../../pages/communityDetailPage';
import { testData } from '../../data/testData';

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

  // Test design: https://app.qase.io/case/RDM-42
  test(qase(42, 'Pages'), async () => {  
    // Navigate to the 'Communities' -> first community
    await newCommunity.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
  
    // Navigate to the 'Settings' section -> 'Pages' menu
    await communityDetail.navigateToSettingsSection();
    await communityDetail.navigateToPages();
  
    // Dynamically fill the 'Curation policy' text area
    const curationPolicyText = testData.upload.recordDescription();
    await communityDetail.fillCurationPolicy(curationPolicyText);
    console.log(`'Curation policy' filled with: "${curationPolicyText}"`);
  
    // Dynamically fill the 'About page' text area
    const aboutPage = testData.upload.recordDescription();
    await communityDetail.fillAboutPage(aboutPage);
    console.log(`'About page' filled with: "${aboutPage}"`);
  
    // Click 'Save' button
    await communityDetail.clickSaveButtonPages();
  
    // Navigate to the 'Curation policy' section
    await communityDetail.navigateToCurationPolicySection();
  
    // Assert that the 'Curation policy' text matches the expected value
    const savedCurationPolicyText = await communityDetail.verifyCurationPolicyText();
    if (savedCurationPolicyText !== curationPolicyText) {
      throw new Error(
        `Curation policy text mismatch! Expected: "${curationPolicyText}", but got: "${savedCurationPolicyText}"`
      );
    }
    console.log(`Verified 'Curation policy' text matches: "${curationPolicyText}"`);
  
    // Navigate to the 'Curation policy' section
    await communityDetail.navigateToAboutSection();
    
    // Assert that the 'About' text matches the expected value
    const savedAboutPageText = await communityDetail.verifyAboutText();
    if (savedAboutPageText !== aboutPage) {
      throw new Error(
        `About page text mismatch! Expected: "${aboutPage}", but got: "${savedAboutPageText}"`
      );
    }
    console.log(`Verified 'About page' text matches: "${aboutPage}"`);
  });
});