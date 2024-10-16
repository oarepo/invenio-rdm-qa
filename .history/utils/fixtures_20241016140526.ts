import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { mkdirSync } from 'fs';
import { join } from 'path';
import { testData } from '../data/testData';
import { urls } from '../data/urls';
import { UploadPage } from '../pages/uploadPage';

// Create directory for storing screenshots if it doesn't exist
const screenshotDir = './screenshots';
mkdirSync(screenshotDir, { recursive: true }); // Ensure the directory exists

// Extend Playwright's base fixture to include login page and browser context setup
export const test = base.extend<{
  loginPage: LoginPage; // Fixture for LoginPage interaction
  uploadPage: UploadPage; // Fixture for UploadPage interaction
  page: Page; // Fixture for the page object
  context: BrowserContext; // Fixture for browser context
  loggedInPage: Page; // Fixture for page with user logged in
  uploadFileSuccessfully: () => Promise<void>; // Fixture for successful file upload
}>({
  // Browser context fixture with viewport size set to 1920x1080
  context: async ({ browser }, use) => {
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    await use(context);
    // Note: Let Playwright handle closing the context after all tests
  },

  // Page fixture tied to the above context
  page: async ({ context }, use) => {
    const page = await context.newPage(); // Create a new page within the context
    await use(page); // Pass the page to tests
    await page.close(); // Close page after each test
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

  // Fixture that logs in before each test
  loggedInPage: async ({ page, loginPage }, use) => {
    await page.goto(urls.baseURL); // Navigate to base URL
    await loginPage.login(testData.email, testData.password); // Perform login using test data
    await use(page); // Pass the logged-in page to tests
  },

  // Fixture for successful file upload (precondition)
  uploadFileSuccessfully: async ({ uploadPage }, use) => {
    const currentlySelectedType = "your-type";  // Define or pass this as needed

    // Perform the upload steps (this is your precondition)
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

    //await use();
  }
});

// Capture screenshot on test failure (as a fixture)
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') { // Check if the test failed
    const screenshotPath = join(screenshotDir, `${testInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}.png`); // Define screenshot path
    await page.screenshot({ path: screenshotPath, fullPage: true }); // Capture a full-page screenshot
    console.log(`Screenshot captured at: ${screenshotPath}`); // Log screenshot path for debugging
  }
});

// Re-export Playwright's expect for use in tests
export { expect };