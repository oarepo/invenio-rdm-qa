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

  // Navigate to the first community in the list of communities ('Communities' -> 'My communities' section)
  async navigateToFirstCommunity() {
    await this.page.locator('div.centered.image.fallback_image').nth(0).click();
  }

  // Navigate to the 'Requests' section
  async navigateToRequestsSection() {
    await this.page.locator('a.item i.inbox.icon').click();
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
    await this.page.locator('label[for="members-confirm"]').click();
    console.log('Clicked the label for members confirm checkbox.');
  }

  // Check delete records checkbox ('Permanently delete community' pop up dialog)
  async clickRecordsConfirmCheckbox() {
    await this.page.locator('label[for="records-confirm"]').click();
    console.log('Clicked the label for records confirm checkbox.');
  }

  // Check delete identifier checkbox ('Permanently delete community' pop up dialog)
  async clickSlugConfirmCheckbox() {
    await this.page.locator('label[for="slug-confirm"]').click();
    console.log('Clicked the label for slug confirm checkbox.');
  }

  // Method to fill in the delete confirmation input with the community identifier from the label
  async fillDeleteConfirmationInput() {
    // Locate the label text and extract the identifier inside the <strong> tag
    const identifier = await this.page.locator('label[for="confirm-delete"] strong').textContent();

    // Fill the identifier into the confirmation input field
    if (identifier) {
      await this.page.locator('#confirm-delete').fill(identifier);
      console.log(`Filled the delete confirmation input with the community identifier: ${identifier}`);
    } else {
      console.log('Could not retrieve the community identifier from the label.');
    }
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

  // Method to click the 'Permanently delete' button
  async clickPermanentlyDeleteButton() {
    const deleteButton = this.page.locator('button.ui.negative.button', { hasText: 'Permanently delete' });
  
    // Wait for the button to be visible
    await deleteButton.waitFor({ state: 'visible' });
  
    // Ensure the button is enabled before clicking
    if (await deleteButton.isEnabled()) {
      await deleteButton.click();
      console.log('Clicked the "Permanently delete" button.');
    } else {
      console.log('The "Permanently delete" button is not enabled.');
    }
  }

  // Method to click the second 'Accept and publish' button by directly indexing in the selector
  async clickAcceptAndPublishButton() {
    await this.page.locator('button:has-text("Accept and publish"):nth-of-type(2)').click();
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

  // Method to verify the community name is not present in the list
  async verifyCommunityNotPresent(communityName: string) {
    // Selector for a community item by its name (update selector if needed to match actual structure)
    const communityNameLocator = this.page.locator('.community-list .community-item', { hasText: communityName });
  
    // Assert the community is not present in the list
    await expect(communityNameLocator).toHaveCount(0);
    console.log(`Verified the community "${communityName}" is not present in the list.`);
  }
}