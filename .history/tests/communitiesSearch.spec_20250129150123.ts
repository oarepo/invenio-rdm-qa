import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';

test.describe('Search and Filter', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communityName: string;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity (loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-50
  test(qase(50, 'Communities - Search'), async () => {  

    // Navigate to the "new community"
    await newCommunity.navigateToNewCommunities();

    // Fill in 'Community name' and 'Identifier' field
    communityName = await newCommunity.fillCommunityName();
    await newCommunity.fillCommunityIdentifier();

    // Click 'Create community' button
    await newCommunity.clickCreateCommunity();

    // Validate that the community name is present on the page after creation
    await newCommunity.verifyCommunityName(communityName);

    // Navigate to the 'Communities'
    await newCommunity.navigateToCommunities();

    // Get the name of the first community and check if it matches the generated community name
    const firstCommunityNameLocator = await newCommunity.getFirstCommunityName();
    const firstCommunityName = await firstCommunityNameLocator.textContent();
    
    // Assert that the first community name matches the generated community name
    await uploadPage.waitForTwoSeconds();
    expect(firstCommunityName?.trim()).toBe(communityName);
    console.log(`Verified the first community name in the list: ${firstCommunityName?.trim()}`);
  });
});
