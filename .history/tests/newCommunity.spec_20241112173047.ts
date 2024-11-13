import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    newCommunity = new NewCommunity (loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(1, 'New Community'), async () => {  

    // Navigate to the "new community"
    await newCommunity.navigateToNewCommunities();

    // Fill in 'Community name' and 'Identifier' field
    await newCommunity.fillCommunityName();
    await newCommunity.fillCommunityIdentifier();

    // Click 'Create community' button
    await newCommunity.clickCreateCommunity();

  });
});
