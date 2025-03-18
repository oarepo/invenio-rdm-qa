import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { testData } from '../data/testData';
import { urls } from '../data/urls';
import { UploadPage } from '../pages/newUploadPage';
import { NewCommunity } from '../pages/newCommunityPage';
import { CommunityDetail } from '../pages/communityDetailPage';

/**
 * Playwright Fixtures:
 * Allow you to define reusable setup and teardown logic that
 * can be shared across multiple tests. By organizing initialization, preconditions, 
 * and reusable actions in fixtures, you can create consistent test environments and
 * simplify individual test cases. Each fixture has lifecycle hooks (`beforeAll`, `afterAll`, 
 * `beforeEach`, `afterEach`), allowing it to manage setup and teardown cleanly.
 */

// Create directory for storing screenshots if it doesn't exist
const screenshotDir = './screenshots';
mkdirSync(screenshotDir, { recursive: true }); // Ensure the directory exists

// Extend Playwright's base fixture to include login page and browser context setup
export const test = base.extend<{
  loginPage: LoginPage; // Fixture for LoginPage interaction
  uploadPage: UploadPage; // Fixture for UploadPage interaction
  newCommunity: NewCommunity; // Fixture for NewCommunity interaction
  page: Page; // Fixture for the page object
  context: BrowserContext; // Fixture for browser context
  loggedInPage: Page; // Fixture for page with user logged in
  communityDetail: CommunityDetail;
  uploadFileSuccessfully: () => Promise<void>; // Fixture for successful file upload
  uploadFileForm: () => Promise<void>; // Fixture for successful file upload
  createNewCommunity: () => Promise<string>; // Fixture for creating a community
  createCommunityAndUploadFile: (currentlySelectedType: string) => Promise<void>; // Fixture for creating a community and uploading a file
  createCommunityAndUploadFiles: (currentlySelectedType: string) => Promise<void>; // Fixture for creating a community and uploading a files (open, metadata, embargo)
  inviteNewMemberToCommunity: () => Promise<string>; //Fixture for invite a new member to the existing community
  inviteNewMemberSection: () => Promise<string>; //Fixture for invite a new member to the existing community

}>({
  // Browser context fixture with viewport size set to 1920x1080
  context: async ({ browser }, use) => {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    await use(context);
    // Let Playwright handle closing the context after all tests
  },

  // Page fixture tied to the above context
  page: async ({ context }, use) => {
    const page = await context.newPage(); // Create a new page within the context
    await use(page); // Pass the page to tests
    // No need to manually close the page, Playwright handles this
  },

  // LoginPage fixture for handling login actions
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page); // Initialize LoginPage with page object
    await use(loginPage); // Pass loginPage to tests
  },

  // UploadPage fixture for handling upload actions
  uploadPage: async ({ page }, use) => {
    const uploadPage = new UploadPage(page);
    await use(uploadPage); // Pass uploadPage to tests
  },

  // NewCommunity fixture for handling community actions
  newCommunity: async ({ page }, use) => {
    const newCommunity = new NewCommunity(page);
    await use(newCommunity); // Pass newCommunity to tests
  },

  // Fixture that logs in before each test
  loggedInPage: async ({ page, loginPage }, use) => {
    await page.goto(urls.baseURL); // Navigate to base URL
    await loginPage.login(testData.email, testData.password); // Perform login using test data
    await use(page); // Pass the logged-in page to tests
  },

  // CommunityDetail fixture for handling community details actions
  communityDetail: async ({ page }, use) => {
    const communityDetail = new CommunityDetail(page);
    await use(communityDetail); // Pass communityDetail to tests
  },

  // Fixture for creating a new file upload
  uploadFileSuccessfully: async ({ uploadPage }, use) => {
    const currentlySelectedType = "your-type";  // You can dynamically pass this in your test if needed

    // Perform the upload steps
    await uploadPage.navigateToUploadSection();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true); // Adjust based on test needs
    await uploadPage.selectResourceType(currentlySelectedType);
    await uploadPage.uploadRandomFile();
    await uploadPage.clickPublish();
    await uploadPage.clickPublishOnConfirmation();
    await uploadPage.waitForTwoSeconds();
    await uploadPage.navigateToHome();

    await use(); // This allows the test to continue after the fixture has run
  },

  // Fixture for fill in rows in a new file upload form
  uploadFileForm: async ({ uploadPage }, use) => {
    const currentlySelectedType = "your-type";  // You can dynamically pass this in your test if needed

    // Perform the upload steps
    await uploadPage.navigateToUploadSection();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true); // Adjust based on test needs
    await uploadPage.selectResourceType(currentlySelectedType);
    await uploadPage.uploadRandomFile();
    await uploadPage.waitForTwoSeconds();

    await use(); // This allows the test to continue after the fixture has run
  },

  // Fixture for creating a new community
  createNewCommunity: async ({ newCommunity }, use) => {
    await newCommunity.navigateToNewCommunities();
    await newCommunity.fillCommunityName();
    await newCommunity.fillCommunityIdentifier();
    await newCommunity.clickCreateCommunity();
    
    await use();
  },

  // Fixture for creating a new community
  inviteNewMemberSection: async ({ communityDetail }, use) => {
    await communityDetail.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToMembersSection();
    await communityDetail.clickInviteButton();
    
    await use();
  },

  // Fixture for invite a new member to the existing community
  inviteNewMemberToCommunity: async ({ communityDetail }, use) => {
    await communityDetail.navigateToCommunities();
    await communityDetail.navigateToFirstCommunity();
    await communityDetail.navigateToMembersSection();
    await communityDetail.clickInviteButton();
    await communityDetail.fillMember();
    await communityDetail.selectRoleByIndex(2);
    await communityDetail.clickInviteButtonConfirmation();
    
    await use();
  },

  // Fixture for creating a community and uploading a file
  createCommunityAndUploadFiles: async ({ newCommunity, uploadPage }, use) => {
    test.setTimeout(120000)
    const currentlySelectedType = 'Image';
    
    // Step 1: Create a new community
    await newCommunity.navigateToNewCommunities();
    const communityName = await newCommunity.fillCommunityName();
    await newCommunity.fillCommunityIdentifier();
    await newCommunity.clickCreateCommunity();

    // Step 2: Upload a file and fill in all mandatory fields
    await uploadPage.navigateToUploadSection();
    await uploadPage.waitForTwoSeconds();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);
    await uploadPage.uploadRandomFile();

    // Step 3: Associate the uploaded file with the created community
    await uploadPage.clickSelectCommunityButton();
    await uploadPage.clickMyCommunitiesTab();
    await uploadPage.clickSelectButton(communityName);

    // Step 4: Submit the record for review and publish it
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButton();
    await uploadPage.clickAcceptAccessToRecord();
    await uploadPage.clickAcceptPublishRecord();
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButtonConfirm();
    await uploadPage.clickAcceptAndPublishButton();
    await uploadPage.clickConfirmationAcceptAndPublishButton();

    // Step 5: Create a New upload - metadata only and associate it with a created community
    await uploadPage.navigateToUploadSection();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);
    await uploadPage.checkFirstMetadataOnlyCheckbox();
    await uploadPage.clickSelectCommunityButton();
    await uploadPage.clickMyCommunitiesTab();
    await uploadPage.clickSelectButton(communityName);
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButton();
    await uploadPage.clickAcceptAccessToRecord();
    await uploadPage.clickAcceptPublishRecord();
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButtonConfirm();
    await uploadPage.clickAcceptAndPublishButton();
    await uploadPage.clickConfirmationAcceptAndPublishButton();

    // Step 6: Create a New upload - embargo
    await uploadPage.navigateToUploadSection();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);
    await uploadPage.uploadRandomFile();
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickFullRecordRestrictedButton();
    await uploadPage.checkEmbargoCheckbox();
    await uploadPage.setEmbargoUntilDate();
    await uploadPage.fillEmbargoReason();
    await uploadPage.clickSelectCommunityButton();
    await uploadPage.clickMyCommunitiesTab();
    await uploadPage.clickSelectButton(communityName);
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButton();
    await uploadPage.clickAcceptAccessToRecord();
    await uploadPage.clickAcceptPublishRecord();
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButtonConfirm();
    await uploadPage.clickAcceptAndPublishButton();
    await uploadPage.clickConfirmationAcceptAndPublishButton();
    
    await use();
  },

  // Fixture for creating a community and uploading a files - open, metadata only and embargo 
  createCommunityAndUploadFile: async ({ newCommunity, uploadPage }, use) => {
    test.setTimeout(60000)
    const currentlySelectedType = "your-type";
    
    // Step 1: Create a new community
    await newCommunity.navigateToNewCommunities();
    const communityName = await newCommunity.fillCommunityName();
    await newCommunity.fillCommunityIdentifier();
    await newCommunity.clickCreateCommunity();

    // Step 2: Upload a file and fill in all mandatory fields
    await uploadPage.navigateToUploadSection();
    await uploadPage.waitForTwoSeconds();
    await uploadPage.fillTitle(testData.upload.recordTitle());
    await uploadPage.fillFamilyName(testData.upload.familyName());
    await uploadPage.selectDOIOption(true);
    await uploadPage.selectResourceType(currentlySelectedType);
    await uploadPage.uploadRandomFile();

    // Step 3: Associate the uploaded file with the created community
    await uploadPage.clickSelectCommunityButton();
    await uploadPage.clickMyCommunitiesTab();
    await uploadPage.clickSelectButton(communityName);

    // Step 4: Submit the record for review and publish it
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButton();
    await uploadPage.clickAcceptAccessToRecord();
    await uploadPage.clickAcceptPublishRecord();
    await uploadPage.waitForTwoSeconds();
    await uploadPage.clickSubmitReviewButtonConfirm();
    await uploadPage.clickAcceptAndPublishButton();
    await uploadPage.clickConfirmationAcceptAndPublishButton();
    
    await use();
  },
});

// Capture screenshot on test failure (as a fixture)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') { // Check if the test failed
    const screenshotPath = join(screenshotDir, `${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`); // Define screenshot path
    await page.screenshot({ path: screenshotPath, fullPage: true }); // Capture a full-page screenshot
    console.log(`Screenshot captured at: ${screenshotPath}`); // Log screenshot path for debugging

    // Add a delay before the test is retried
    console.log('Test failed, waiting 61 seconds before retrying...');
    await new Promise(resolve => setTimeout(resolve, 61000));
  }
});

// Re-export Playwright's expect for use in tests
export { expect };
