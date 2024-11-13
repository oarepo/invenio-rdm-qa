import { Page, expect } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';
import { testData } from '../data/testData';
import { urls } from '../data/urls';

export class CommunityDetail {
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
  async navigateToCommunities() {
    await this.uiHelper.goto(urls.communitiesURL); 
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

  // Method to edit the 'Community name' by appending '_EDITED'
  async editCommunityName() {
    // Locate the 'Community name' field and get the current value
    const nameField = this.page.locator('#metadata\\.title');
    const currentName = await nameField.inputValue();

    // Append '_EDITED' to the existing name
    const editedName = `${currentName}_EDITED`;

    // Fill the field with the new name
    await nameField.fill(editedName);

    console.log(`Updated the community name to: ${editedName}`);
    return editedName;
  }


// BUTTONS -----------------------------------------------------------------------------

  // Method to click the 'Save' button
  async clickSaveButton() {
    await this.page.locator('button.ui.icon.primary.left.labeled.button').click();
    console.log(`Clicked the Save button.`);
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }

  // Method to get the community name ('Settings' menu in the community detail)
  getCommunityName() {
    return this.page.locator('h1.ui.medium.header.mb-0');
  }

  // Method to check name of the first community in 'Communities' list
  async getFirstCommunityName() {
    return this.page.locator('.content .header').first();  }

  // Method to verify that the community name matches the generated name
  async verifyCommunityName(expectedCommunityName: string) {
    const communityNameLocator = this.getCommunityName();
    const actualCommunityName = await communityNameLocator.textContent();

    // Assertion to check the community name
    expect(actualCommunityName).not.toBeNull();
    await expect(communityNameLocator).toHaveText(expectedCommunityName);
    console.log(`Verified the community name is present on the page and matches: ${expectedCommunityName}`);
  }

  // Method to verify if the community name was updated successfully
  async verifyUpdatedCommunityName(expectedCommunityName: string) {
    const communityNameLocator = this.getCommunityName();
    const actualCommunityName = await communityNameLocator.textContent();

    // Assertion to check if the community name matches the edited name
    expect(actualCommunityName).toContain(expectedCommunityName);
    console.log(`Verified the community name was successfully updated to: ${expectedCommunityName}`);
  }
}