import { Page } from '@playwright/test';
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
    await this.uiHelper.navigateToHome();
  }

  // Navigate to the 'Communities' page using the helper
  async navigateToNewCommunities() {
    await this.uiHelper.goto(urls.newCommunityURL); 
  }

  // Navigate to the 'My Dashboard' page using the helper
  async navigateToMyDashboard() {
    await this.uiHelper.navigateToMyDashboard();
  }

  // Navigate to the detail of the first record using the helper
  async firstRecordDetail() {
    await this.uiHelper.firstRecordDetail();
  }

// FIELDS ------------------------------------------------------------------------------  

 // Method to fill in the 'Community name' field (by faker)
 async fillCommunityName() {
    const communityName = testData.upload.communityName();
    await this.page.locator('#metadata\\.title').fill(communityName);
    console.log(`Filled the community name field with: ${communityName}`);
  }

  // Method to fill in the 'Identifier' field (by Faker)
  async fillCommunityIdentifier() {
    const communityIdentifier = testData.upload.communityIdentifier(); // Get the generated slug
    await this.page.locator('#slug').fill(communityIdentifier); // Fill the slug field
    console.log(`Filled the community identifier field with: ${communityIdentifier}`);
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click the 'New community' button
  async clickNewCommunity() {
    await this.page.getByRole('button', { name: 'New community' }).click();
 // await this.page.locator('a.ui.icon.left.labeled.positive.button').click();
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
    console.log(`Clicked the Create community button.`);
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}