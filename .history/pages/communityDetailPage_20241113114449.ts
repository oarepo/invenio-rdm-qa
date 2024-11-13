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

  // Check delete members checkbox ('Permanently delete community' pop up dialog)
  async clickMembersConfirmCheckbox() {
    await this.page.locator('#members-confirm').click();
    console.log('Clicked the members confirm checkbox.');
  }

  // Check delete records checkbox ('Permanently delete community' pop up dialog)
  async clickRecordsConfirmCheckbox() {
    await this.page.locator('#records-confirm').click();
    console.log('Clicked the records confirm checkbox.');
  }

  // Check delete identifier checkbox ('Permanently delete community' pop up dialog)
  async clickSlugConfirmCheckbox() {
    await this.page.locator('#slug-confirm').click();
    console.log('Clicked the slug confirm checkbox.');
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click the 'Save' button
  async clickSaveButton() {
    await this.page.locator('button.ui.icon.primary.left.labeled.button').click();
    console.log(`Clicked the Save button.`);
  }

  // Method to click the 'Delete community' button
  async clickDeleteCommunityButton() {
    const deleteButton = this.page.locator('#delete-community-button'); // Using the ID selector
    await deleteButton.click(); // Click the button
    console.log('Clicked the Delete community button.');
  }

// VERIFICATION ------------------------------------------------------------------------

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