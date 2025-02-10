import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { RecordDetail } from '../pages/recordDetailPage';
import { MyDashboard } from '../pages/myDashboardPage';

test.describe('Record Landing Page', () => {
  let uploadPage: UploadPage;
  let recordDetailPage: RecordDetail;
  let myDashboard: MyDashboard;

  // Setup: Log in, navigate to the upload page, and upload a file
  test.beforeEach(async ({ loggedInPage, uploadFileSuccessfully }) => {
    uploadPage = new UploadPage(loggedInPage); // Use the logged-in page
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
    
    // Select 'Harvard' from the citation dropdown
    await recordDetailPage.selectCitationStyle('Harvard');

    // Verify the dropdown displays 'Harvard'
    const selectedStyleHarvard = await recordDetailPage.getSelectedStyle();
    expect(selectedStyleHarvard).toBe('Harvard');
   
    // Validate citation format for Harvard
    const citationHarvard = await recordDetailPage.getCitationText();
    expect(citationHarvard).not.toBe(""); // Ensure citation text is not empty
    
    // Validate key components in the citation
    expect(citationHarvard).toContain('CERN');
    expect(citationHarvard).toMatch(/\(20\d{2}\)/); // Ensure it contains a year in parentheses
    expect(citationHarvard).toMatch(/doi: \d{2}\.\d{5}\/[a-z0-9-]+/); // Ensure it contains a DOI

    // Select 'APA' from the citation dropdown
    await recordDetailPage.selectCitationStyle('APA');

    // Verify the dropdown displays 'APA'
    const selectedStyleApa = await recordDetailPage.getSelectedStyle();
    expect(selectedStyleApa).toBe('APA');

    // Validate citation format for APA
    const citationApa = await recordDetailPage.getCitationText();
    expect(citationApa).not.toBe(""); // Ensure citation text is not empty
    
    // Validate key components in the citation
    expect(citationApa).toContain('CERN');
    expect(citationApa).toMatch(/\(20\d{2}\)/); // Ensure it contains a year in parentheses
    expect(citationApa).toMatch(/https:\/\/doi\.org\/\d{2}\.\d{5}\/[a-z0-9-]+/); // Ensure it contains a DOI URL

    // Select 'IEEE' from the citation dropdown
    await recordDetailPage.selectCitationStyle('IEEE');

    // Verify the dropdown displays 'IEEE'
    const selectedStyleIeee = await recordDetailPage.getSelectedStyle();
    expect(selectedStyleIeee).toBe('IEEE');

    // Validate citation format for IEEE
    const citationIeee = await recordDetailPage.getCitationText();
    expect(citationIeee).not.toBe(""); // Ensure citation text is not empty
    
    // Validate key components in the citation
    expect(citationIeee).toContain('CERN');
    expect(citationIeee).toMatch(/\[\d+\]/); // Ensure it contains a citation number
    expect(citationIeee).toMatch(/doi: \d{2}\.\d{5}\/[a-z0-9-]+/); // Ensure it contains a DOI
  });
});

