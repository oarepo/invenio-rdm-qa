import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/uploadPage';
import { qase } from 'playwright-qase-reporter';

test.describe('New Upload', () => {
  let uploadPage: UploadPage;
  let communityName: string;

  test.beforeEach(async ({ loggedInPage, createNewCommunity }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page

    // Use the createNewCommunity fixture to create a community and store the name
    communityName = await createNewCommunity();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(2, 'Edit Community'), async () => {  
    // Your test steps can now assume that the community has already been created

    // Use the communityName variable if needed for verification or further actions
    console.log(`Community created with name: ${communityName}`);
    
    // Navigate to the "upload" section or perform additional test steps as needed
    await uploadPage.navigateToUploadSection();

    // Continue with other actions in the test...
  });
});
