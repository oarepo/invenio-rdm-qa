import { Page, expect } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';
import { testData } from '../data/testData';
import { urls } from '../data/urls';
import { RecordDetail } from './recordDetailPage';

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
    console.log('Navigating to the homepage...');
    await this.uiHelper.navigateToHome();
    await this.page.waitForSelector('h1.ui.center.aligned.header.inverted', { state: 'visible' });
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

  // Navigate to the first community in the list of communities ('Communities' -> 'My communities' section)
  async navigateToFirstCommunity() {
    console.log('Navigating to the First Community detail...');
    await this.page.waitForSelector('div.centered.image.fallback_image:nth-of-type(1)', { state: 'visible' });
    await this.page.locator('div.centered.image.fallback_image').nth(0).click();
    await this.page.waitForSelector('a.item.active:has-text("Records")', { state: 'visible' });
  }

  // Navigate to the 'Records' section
  async navigateToRecordsSection(): Promise<void> {
    const recordsLink = this.page.locator('a.item.active:has-text("Records")');
    await recordsLink.click();
    console.log('Clicked on the "Records" link');
  }

  // Navigate to the 'Requests' section
  async navigateToRequestsSection() {
    console.log('Navigating to the Requests section...');
    await this.page.waitForSelector('a.item i.inbox.icon', { state: 'visible' });
    await this.page.locator('a.item i.inbox.icon').click();
    await this.page.waitForSelector('button:has-text("Open")', { state: 'visible' });
  }

  // Navigate to the 'Closed' section (in 'Requests')
  async navigateToClosedSection() {
    console.log('Navigating to the Closed Requests...');
    await this.page.waitForSelector('button.request-search-filter:has-text("Closed")', { state: 'visible' });
    await this.page.locator('button.request-search-filter:has-text("Closed")').click();
  }

// FIELDS ------------------------------------------------------------------------------  

  // Method to edit the 'Community name' by appending '_EDITED'
  async editCommunityName() {
    // Locate the 'Community name' field and get the current value
    const nameField = this.page.locator('#metadata\\.title');
    await nameField.waitFor({ state: 'visible' });
    
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
    const saveButton = this.page.locator('button.ui.icon.primary.left.labeled.button');
    
    // Wait for the button to be visible and enabled
    await saveButton.waitFor({ state: 'visible' });
    if (await saveButton.isEnabled()) {
        await saveButton.click();
        console.log(`Clicked the Save button.`);
    } else {
        console.log('Save button is not enabled.');
    }
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

  // Method to click the 'Accept and publish' button 
  async clickAcceptAndPublishButton() {
    const buttonLocator = this.page.locator('button:has-text("Accept and publish")');
    await buttonLocator.nth(0).waitFor({ state: 'visible' });  // wait for the first button to appear
    await buttonLocator.nth(0).click();
    console.log('Clicked the "Accept and publish" button.');
  }

  // Method to click the 'Accept and publish' confirmation button 
  async clickConfirmationAcceptAndPublishButton() {
    const buttonLocator = this.page.locator('button:has-text("Accept and publish")');
    await buttonLocator.nth(2).waitFor({ state: 'visible' });  // wait for the first button to appear
    await buttonLocator.nth(2).click();
    console.log('Clicked the confirmation "Accept and publish" button.');
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
    await communityNameLocator.waitFor({ state: 'visible' });

    const actualCommunityName = await communityNameLocator.textContent();

    // Assertion to check the community name
    expect(actualCommunityName).not.toBeNull();
    await expect(communityNameLocator).toHaveText(expectedCommunityName);
    console.log(`Verified the community name is present on the page and matches: ${expectedCommunityName}`);
  }

  // Method to verify if the community name was updated successfully
  async verifyUpdatedCommunityName(expectedCommunityName: string) {
    const communityNameLocator = this.getCommunityName();
    await communityNameLocator.waitFor({ state: 'visible' });

    const actualCommunityName = await communityNameLocator.textContent();

    // Assertion to check if the community name matches the edited name
    expect(actualCommunityName).toContain(expectedCommunityName);
    console.log(`Verified the community name was successfully updated to: ${expectedCommunityName}`);
  }

  // Method to verify the community name is not present in the list
  async verifyCommunityNotPresent(communityName: string) {
    // Selector for a community item by its name
    const communityNameLocator = this.page.locator('.community-list .community-item', { hasText: communityName });
  
    // Assert the community is not present in the list
    await expect(communityNameLocator).toHaveCount(0);
    console.log(`Verified the community "${communityName}" is not present in the list.`);
  }

  // Method to verify the record request was successfully accepted 
  async verifyRequestAcceptance() {
    const allDone = this.page.locator('h1.ui.icon.header:has-text("All done!")');
    await allDone.waitFor({ state: 'visible' });
    const isHeaderVisible = await allDone.isVisible();
    expect(isHeaderVisible).toBe(true);
    console.log('Verified the request was successfully accepted and "All done!" is visible.');
  }

  // Method to verify that the verified closed request exists (record was accepted and is in 'Closed' list)
  async verifyClosedResultsFound() {
    const resultsLocator = this.page.locator('div.four.wide.column:has-text("1 results found")');
    await resultsLocator.waitFor({ state: 'visible' });
    const isVisible = await resultsLocator.isVisible();
    expect(isVisible).toBe(true);
    console.log('Verified the closed results are found.');
  }

  // Method to verify the presence of date tag in a record ('Records' page)
  async verifyDateTag() {
    const labelLocator = this.page.locator('div.ui.small.horizontal.label.primary');
    const isVisible = await labelLocator.isVisible();

    // Assert that the element is visible on the page
    expect(isVisible).toBe(true);
    console.log('Verified the label with the date is visible on the page');
  }

  // Method to check the presence of the 'Restricted' access status label
  async verifyRestrictedLabel(): Promise<boolean> {
    const restrictedLabelLocator = this.page.locator('div.ui.small.horizontal.label.access-status.restricted');
  
    // Wait for the restricted label to be present in the DOM
    try {
        await restrictedLabelLocator.waitFor({ state: 'visible', timeout: 5000 });
        const isVisible = await restrictedLabelLocator.isVisible();
        console.log('Verified: The "Restricted" access status label is visible.');
        return isVisible;
    } catch (error) {
        console.log('The "Restricted" access status label is not visible.');
        return false;
  }
}

// Method to check if the 'Restricted' record is not present
async verifyRestrictedRecordNotPresent(): Promise<boolean> {
  const noRecordsHeader = this.page.locator('h2.ui.header:has-text("We couldn\'t find any matches for your search")');
  
  // Wait for the "no matches" header to become visible
  try {
      await noRecordsHeader.waitFor({ state: 'visible', timeout: 5000 });
      const isVisible = await noRecordsHeader.isVisible();
      console.log('Verified: The "Restricted" record is not present (no matches found).');
      return isVisible;
  } catch (error) {
      console.log('The "No matches found" message is not visible, indicating the "Restricted" record might be present.');
      return false;
  }
}
}