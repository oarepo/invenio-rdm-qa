import { test, expect } from '../utils/fixtures';
import { testData } from '../data/testData';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';

test.describe('New Upload', () => {
  let currentlySelectedType: string;
  let newCommunity: NewCommunity;

  test.beforeEach(async ({ loggedInPage, uploadPage, createCommunityAndUploadFile }) => {
    // Execute the fixture to create a community and upload a file
    currentlySelectedType = 'dataset'; // Define your resource type dynamically if needed
    newCommunity = new NewCommunity(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  test(qase(24, 'Community Visibility - Public'), async ({ uploadPage }) => {

    // Navigate to the 'New Community' page
    await newCommunity.navigateToNewCommunities();

  });
});
