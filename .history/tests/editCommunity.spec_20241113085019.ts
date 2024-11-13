import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;

  test.beforeEach(async ({ loggedInPage, createNewCommunity }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
    newCommunity = new NewCommunity(loggedInPage); // Initialize NewCommunity for further use if needed
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(2, 'Edit Community'), async () => {  
    
    // Change community name
    await uploadPage.waitForTwoSeconds();
    await newCommunity.editCommunityName();
    
  });
});
