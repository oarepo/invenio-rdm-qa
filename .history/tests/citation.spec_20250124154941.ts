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
    
    // Validate key components in the Harvard citation with detailed logging
    console.log('Citation Text (Harvard):', citationHarvard);
    const hasCern = citationHarvard.includes('CERN');
    const hasYear = /\(20\d{2}\)/.test(citationHarvard);
    const hasDoi = /doi: \d{2}\.\d{5}\/[a-z0-9-]+/.test(citationHarvard);
    
    console.log('Contains CERN:', hasCern);
    console.log('Contains Year:', hasYear);
    console.log('Contains DOI:', hasDoi);
    
    const componentsHarvard = [hasCern, hasYear, hasDoi];
    expect(componentsHarvard.every(Boolean)).toBe(true);

    // Select 'APA' from the citation dropdown
    await recordDetailPage.selectCitationStyle('APA');

    // Verify the dropdown displays 'APA'
    const selectedStyleApa = await recordDetailPage.getSelectedStyle();
    expect(selectedStyleApa).toBe('APA');

    // Validate citation format for APA
    const citationApa = await recordDetailPage.getCitationText();
    expect(citationApa).not.toBe(""); // Ensure citation text is not empty
    
    // Validate key components in the APA citation with detailed logging
    console.log('Citation Text (APA):', citationApa);
    const hasCernApa = citationApa.includes('CERN');
    const hasYearApa = /\(20\d{2}\)/.test(citationApa);
    const hasDoiApa = /https:\/\/doi\.org\/\d{2}\.\d{5}\/[a-z0-9-]+/.test(citationApa);
    
    console.log('Contains CERN:', hasCernApa);
    console.log('Contains Year:', hasYearApa);
    console.log('Contains DOI:', hasDoiApa);
    
    const componentsApa = [hasCernApa, hasYearApa, hasDoiApa];
    expect(componentsApa.every(Boolean)).toBe(true);

    // Select 'IEEE' from the citation dropdown
    await recordDetailPage.selectCitationStyle('IEEE');

    // Verify the dropdown displays 'IEEE'
    const selectedStyleIeee = await recordDetailPage.getSelectedStyle();
    expect(selectedStyleIeee).toBe('IEEE');

    // Validate citation format for IEEE
    const citationIeee = await recordDetailPage.getCitationText();
    expect(citationIeee).not.toBe(""); // Ensure citation text is not empty
    
    // Validate key components in the IEEE citation with detailed logging
    console.log('Citation Text (IEEE):', citationIeee);
    const hasCernIeee = citationIeee.includes('CERN');
    const hasNumberIeee = /\[\d+\]/.test(citationIeee);
    const hasDoiIeee = /doi: \d{2}\.\d{5}\/[a-z0-9-]+/.test(citationIeee);
    
    console.log('Contains CERN:', hasCernIeee);
    console.log('Contains Citation Number:', hasNumberIeee);
    console.log('Contains DOI:', hasDoiIeee);
    
    const componentsIeee = [hasCernIeee, hasNumberIeee, hasDoiIeee];
    expect(componentsIeee.every(Boolean)).toBe(true);
  });
});