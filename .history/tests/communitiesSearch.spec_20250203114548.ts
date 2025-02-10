import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { Communities } from '../pages/communitiesPage';

test.describe('Search and Filter', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let communities: Communities;

  test.beforeEach(async ({ loggedInPage }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity (loggedInPage);
    communities = new Communities(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-50
  test(qase(50, 'Communities - Search'), async () => {  

    // Navigate to the "new community"
    await communities.navigateToCommunities();

    await communities.fillSearchField('Test Community');
    await communities.submitSearch();
   
  });
});
