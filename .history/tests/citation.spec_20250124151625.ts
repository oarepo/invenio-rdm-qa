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
    await recordDetailPage.waitForTwoSeconds();
   
    // Validate citation format for Harvard
    const citationHarvard = await recordDetailPage.getCitationText();
    console.log('Citation Text:', citationHarvard);

    expect(citationHarvard).not.toBe(""); // Check citation text isn't empty
    const harvardFormatRegex = /^[a-zA-Z]+ \(\d{4}\) [“”"].+["”"]?\.\sCERN\.\sdoi: \d{2}\.\d{5}\/[a-z0-9-]+$/
;
    const isHarvardFormatValid = recordDetailPage.validateCitationFormat(citationHarvard, harvardFormatRegex);
    expect(isHarvardFormatValid).toBe(true);

    // Select 'APA' from the citation dropdown
    await recordDetailPage.selectCitationStyle('APA');

    // Verify the dropdown displays 'APA'
    const selectedStyleApa = await recordDetailPage.getSelectedStyle();
    expect(selectedStyleApa).toBe('APA');
    await recordDetailPage.waitForTwoSeconds();

    // Validate citation format for APA
    const citationApa = await recordDetailPage.getCitationText();
    expect(citationApa).not.toBe(""); // Check citation text isn't empty
    const apaFormatRegex = /^[a-z]+\. \(\d{4}\)\. .+\. CERN\. https:\/\/doi\.org\/\d{2}\.\d{5}\/[a-z0-9-]+$/;
    const isApaFormatValid = recordDetailPage.validateCitationFormat(citationApa, apaFormatRegex);
    expect(isApaFormatValid).toBe(true);

    // Select 'IEEE' from the citation dropdown
    await recordDetailPage.selectCitationStyle('IEEE');

    // Verify the dropdown displays 'IEEE'
    const selectedStyleIeee = await recordDetailPage.getSelectedStyle();
    expect(selectedStyleIeee).toBe('IEEE');
    await recordDetailPage.waitForTwoSeconds();

    // Validate citation format for IEEE
    const citationIeee = await recordDetailPage.getCitationText();
    expect(citationIeee).not.toBe(""); // Check citation text isn't empty
    const ieeeFormatRegex = /^\[\d+\][a-z]+, „.+“\. CERN, [a-z]+\.\s\d{2}, \d{4}\. doi: \d{2}\.\d{5}\/[a-z0-9-]+.$/;
    const isIeeeFormatValid = recordDetailPage.validateCitationFormat(citationIeee, ieeeFormatRegex);
    expect(isIeeeFormatValid).toBe(true);
  });
});