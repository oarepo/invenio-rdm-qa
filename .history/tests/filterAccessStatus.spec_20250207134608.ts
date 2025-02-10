import { test, expect } from '../utils/fixtures';
import { UploadPage } from '../pages/newUploadPage';
import { qase } from 'playwright-qase-reporter';
import { NewCommunity } from '../pages/newCommunityPage';
import { HomePage } from '../pages/homePage';
import { CommunityDetail } from '../pages/communityDetailPage';
import { RecordDetail } from '../pages/recordDetailPage';
import { testData } from '../data/testData';

test.describe('Search and Filter', () => {
  let uploadPage: UploadPage;
  let newCommunity: NewCommunity;
  let homePage: HomePage;
  let communityDetailPage: CommunityDetail;
  let recordDetailPage: RecordDetail;
  let currentlySelectedType: string | null = null;

  test.beforeEach(async ({ loggedInPage, createCommunityAndUploadFile }) => {
    uploadPage = new UploadPage(loggedInPage);
    newCommunity = new NewCommunity (loggedInPage);
    homePage = new HomePage(loggedInPage);
    communityDetailPage = new CommunityDetail(loggedInPage);
    recordDetailPage = new RecordDetail(loggedInPage);
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status === 'failed') {
      await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
    }
  });

  // Test design: https://app.qase.io/case/RDM-38
  test(qase(38, 'Filter - Access Status'), async () => {  

    // Fill in the record details
    await uploadPage.navigateToUploadSection(); // Navigate to the upload section
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);
 
    // Check 'Metadata-only record'checkbox
    await uploadPage.checkFirstMetadataOnlyCheckbox();
 
    // Click the Publish button
    await uploadPage.clickPublish();
 
    // Click the Publish button on the confirmation dialog
    await uploadPage.clickPublishOnConfirmation();
 
    // Fill in the record details
    await uploadPage.navigateToUploadSection();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);

    // Upload a file
    await uploadPage.uploadRandomFile();

    // Select 'Full record' -> 'Restricted'
    await uploadPage.clickFullRecordRestrictedButton();

    // Check 'Apply an embargo' checkbox
    await uploadPage.checkEmbargoCheckbox();
/*
    // Fill in 'Embargo until' field
    await uploadPage.setEmbargoUntilDate();

    // Fill in 'Embargo reason' field
    await uploadPage.fillEmbargoReason();

    // Click the Publish button
    await uploadPage.clickPublish();

    // Click the Publish button on the confirmation dialog
    await uploadPage.clickPublishOnConfirmation();
    await uploadPage.navigateToMyDashboard();
  */

  });
});