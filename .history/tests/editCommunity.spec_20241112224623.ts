import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communityName: string;

  test.beforeEach(async ({ loggedInPage, createNewCommunity }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    communityName = await createNewCommunity(); // Use the createNewCommunity fixture
    newCommunity = new NewCommunity (loggedInPage);

  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(2, 'Edit Community'), async () => {  
    // Navigate to the 'Communities'
    await newCommunity.navigateToCommunities();
  });
});
