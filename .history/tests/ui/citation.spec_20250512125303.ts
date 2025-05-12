import { test, expect } from '../../utils/fixtures';
import { UploadPage } from '../../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { RecordDetail } from '../../pages/recordDetailPage';
import { MyDashboard } from '../../pages/myDashboardPage';

test.describe('Record Landing Page', () => {
  let uploadPage: UploadPage;
  let recordDetailPage: RecordDetail;
  let myDashboard: MyDashboard;

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage, uploadFileSuccessfully }) => {
    uploadPage = new UploadPage(loggedInPage);
    recordDetailPage = new RecordDetail(loggedInPage);
    myDashboard = new MyDashboard(loggedInPage);
  });

  // Teardown: Take a screenshot on failure
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
      console.log(`Teardown complete: Screenshot taken for failed test - ${testInfo.title}.`);
    } else {
      console.log(`Teardown complete: Test ${testInfo.title} passed.`);
    }
  });

  // Test design: https://app.qase.io/case/RDM-46
  test(qase(46, 'Citation'), async () => {
    // Navigate to 'My Dashboard'
    await uploadPage.navigateToMyDashboard();
    
    // Open detail page of the first record
    await uploadPage.firstRecordDetail();
    
    // --- Harvard ---
    await recordDetailPage.selectCitationStyle('Harvard');
    expect(await recordDetailPage.getSelectedStyle()).toBe('Harvard');
    await recordDetailPage.waitForTwoSeconds();

    const citationHarvard = await recordDetailPage.getCitationText();
    expect(citationHarvard).toMatch(/^[a-zA-Z]+[.,]?\s*\(\d{4}\)/);      // author + year
    expect(citationHarvard).toMatch(/CERN/);                             // CERN
    expect(citationHarvard).toMatch(/doi:\s*\d{2}\.\d{5}\/[a-z0-9-]+/);  // DOI

    // --- APA ---
    await recordDetailPage.selectCitationStyle('APA');
    expect(await recordDetailPage.getSelectedStyle()).toBe('APA');
    await recordDetailPage.waitForTwoSeconds();

    const citationApa = await recordDetailPage.getCitationText();
    // Author + year (or year + month + day)
    expect(citationApa).toMatch(/^[a-zA-Z]+\. \(\d{4}(, [A-Za-z]+ \d{1,2})?\)/);
    expect(citationApa).toMatch(/CERN/);                                         // CERN
    expect(citationApa).toMatch(/https:\/\/doi\.org\/\d{2}\.\d{5}\/[a-z0-9-]+/); // DOI link

    // --- IEEE ---
    await recordDetailPage.selectCitationStyle('IEEE');
    expect(await recordDetailPage.getSelectedStyle()).toBe('IEEE');
    await recordDetailPage.waitForTwoSeconds();

    const citationIeee = await recordDetailPage.getCitationText();
    expect(citationIeee).toMatch(/\[\d+\]/);                                     // [number]
    expect(citationIeee).toMatch(/[a-zA-Z]+,/);                                  // author
    expect(citationIeee).toMatch(/CERN/);                                        // CERN
    expect(citationIeee).toMatch(/\d{4}/);                                       // year
    expect(citationIeee).toMatch(/doi:\s*\d{2}\.\d{5}\/[a-z0-9-]+/);             // DOI
  });
});
