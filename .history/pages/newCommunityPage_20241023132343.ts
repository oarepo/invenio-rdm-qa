import { Page } from '@playwright/test';
import { FileUploadHelper } from '../helpers/fileUploadHelper';
import { UIHelper } from '../helpers/uiHelper';
import { urls } from '../data/urls';
import { testData } from '../data/testData';

export class newCommunity {
  private fileUploadHelper: FileUploadHelper;
  private uiHelper: UIHelper;
  public uploadedTitle: string;

  constructor(private page: Page) {
    this.fileUploadHelper = new FileUploadHelper(page);
    this.uiHelper = new UIHelper(page);
    this.uploadedTitle = testData.upload.recordTitle();
  }

// NAVIGATION --------------------------------------------------------------------------

  // Navigate to the homepage page using the helper
  async navigateToHome() {
    await this.uiHelper.navigateToHome();
  }

  // Navigate to the 'Communities' page using the helper
  async navigateToCommunities() {
    await this.uiHelper.navigateToCommunities();
  }

  // Navigate to the 'My Dashboard' page using the helper
  async navigateToMyDashboard() {
    await this.uiHelper.navigateToMyDashboard();
  }

  // Navigate to the "new community" page using the helper
  async navigateToNewCommunity () {
    await this.uiHelper.navigateToNewCommunity();
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
    console.log(`Filled the metadata title field with: ${communityName}`);
  }

  // Method to fill in the 'Identifier' field (by Faker)
  async fillCommunityIdentifier() {
    const generatedSlug = testData.upload.slug(); // Get the generated slug
    await this.page.locator('#slug').fill(generatedSlug); // Fill the slug field
    console.log(`Filled the slug field with: ${generatedSlug}`);
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click the 'New community' button
  async clickNewCommunity() {
    await this.page.getByRole('button', { name: 'New community' }).click();
 // await this.page.locator('a.ui.icon.left.labeled.positive.button').click();
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}