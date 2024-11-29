import { Page, expect } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';
import { testData } from '../data/testData';
import { urls } from '../data/urls';

export class NewCommunity {
  private uiHelper: UIHelper;
  public uploadedTitle: string;

  constructor(private page: Page) {
    this.uiHelper = new UIHelper(page);
    this.uploadedTitle = testData.upload.recordTitle();
  }

// NAVIGATION --------------------------------------------------------------------------

  // Navigate to the homepage page using the helper
  async navigateToHome() {
    console.log('Navigating to the homepage...');
    await this.uiHelper.navigateToHome();
  }

  // Navigate to the 'Communities' page using the helper
  async navigateToCommunities() {
    console.log('Navigating to the Communities page...');
    await this.uiHelper.goto(urls.communitiesURL);
    await this.page.waitForSelector('h1:has-text("Communities")', { state: 'visible' });
  }

  // Navigate to the new community page using the helper
  async navigateToNewCommunities() {
    console.log('Navigating to the New Community page...');
    await this.uiHelper.goto(urls.newCommunityURL);
    await this.page.waitForSelector('h1:has-text("Setup your new community")', { state: 'visible' });
  }

  // Navigate to the 'My Dashboard' page using the helper
  async navigateToMyDashboard() {
    console.log('Navigating to "My Dashboard" page...');
    await this.uiHelper.navigateToMyDashboard();
  }

  // Navigate to the detail of the first record using the helper
  async firstRecordDetail() {
    console.log('Navigating to the first record detail page...');
    await this.uiHelper.firstRecordDetail();
  }

// FIELDS ------------------------------------------------------------------------------  

 // Method to fill in the 'Community name' field (by faker)
 async fillCommunityName() {
    const communityName = testData.upload.communityName();
    await this.page.locator('#metadata\\.title').fill(communityName);
    console.log(`Filled the community name field with: ${communityName}`);
    return communityName;
  }

  // Method to fill in the 'Identifier' field (by Faker)
  async fillCommunityIdentifier() {
    const randomSuffix = Math.floor(Math.random() * 1000000); // Generates a random number up to 999999
    const communityIdentifier = `${testData.upload.communityIdentifier()}_${randomSuffix}`;
    await this.page.locator('#slug').fill(communityIdentifier);
    console.log(`Filled the community identifier field with: ${communityIdentifier}`);
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click the 'New community' button
  async clickNewCommunity() {
    await this.page.getByRole('button', { name: 'New community' }).click();
    console.log('Clicked "New community" button.')
  }

  // Method to select the 'Public' radio button in 'Community visibility'
  async selectPublicCommunity() {
    await this.page.locator("(//input[@type='radio' and @value='public'])[1]").check();
    console.log('Selected Public community visibility.');
  }

  // Method to select the 'Restricted' radio button in 'Community visibility'
  async selectRestrictedCommunity() {
    await this.page.locator("(//input[@type='radio' and @value='public'])[2]").check();
    console.log('Selected Restricted community visibility.');
  }

  // Method to click the 'Create community' button
  async clickCreateCommunity() {
    await this.page.locator('button.ui.icon.positive.left.labeled.button').click();
    console.log(`Clicked the "Create community" button.`);
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method to get the community name ('Settings' menu in the community detail)
  getCommunityName() {
    return this.page.locator('h1.ui.medium.header.mb-0');
  }

  // Method to check name of the first community in 'Communities' list
  async getFirstCommunityName() {
    const firstCommunityLocator = this.page.locator('.content .header').first();
    await firstCommunityLocator.waitFor({ state: 'visible' });
    return firstCommunityLocator;
  }

  // Method to verify that the community name matches the generated name
  async verifyCommunityName(expectedCommunityName: string) {
    const communityNameLocator = this.getCommunityName();
    const actualCommunityName = await communityNameLocator.textContent();

    // Assertion to check the community name
    expect(actualCommunityName).not.toBeNull();
    await expect(communityNameLocator).toHaveText(expectedCommunityName);
    console.log(`Verified the community name is present on the page and matches: ${expectedCommunityName}`);
  }

  // Method to check if the 'You' label is present (Communities -> Members)
  async isYouLabelPresent(): Promise<boolean> {
    const youLabel = this.page.locator('div.ui.tiny.label.primary', { hasText: 'You' });
    await youLabel.waitFor({ state: 'visible' });
    return await youLabel.isVisible();
  }
}