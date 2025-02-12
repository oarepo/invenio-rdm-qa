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
    await this.page.waitForSelector('h1:has-text("Communities")', { state: 'visible', timeout: 3000 });
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
    await this.page.waitForSelector('div.centered.image.fallback_image:nth-of-type(1)', { state: 'visible', timeout: 3000 });
    await this.page.locator('div.centered.image.fallback_image').nth(0).click();
    await this.page.waitForSelector('a.item.active:has-text("Records")', { state: 'visible' });
  }

  // Navigate to the 'Records' section
  async navigateToRecordsSection(): Promise<void> {
    const recordsLink = this.page.locator('a.item.active:has-text("Records")');
    await recordsLink.click();
    console.log('Navigating to the Records section...');
  }

  // Navigate to the first record from 'Records' section
  async navigateToFirstRecord(): Promise<void> {
    const recordLocator = this.page.locator('a[href^="/records/"]');
    await recordLocator.first().click();
    console.log('Navigating to the first record...');
  }

  // Navigate to the 'Requests' section
  async navigateToRequestsSection() {
    console.log('Navigating to the Requests section...');
    await this.page.waitForSelector('a.item i.inbox.icon', { state: 'visible' });
    await this.page.locator('a.item i.inbox.icon').click();
    await this.page.waitForSelector('button:has-text("Open")', { state: 'visible' });
  }

  // Navigate to the 'Members' section
  async navigateToMembersSection(): Promise<void> {
    console.log('Navigating to the Members section...');
    await this.page.click('a.item:has-text("Members")');
  }

  // Navigate to the 'Settings' section
  async navigateToSettingsSection(): Promise<void> {
    console.log('Navigating to the Settings section...');
    await this.page.click('a.item:has-text("Settings")');
  }

  // Navigate to the 'Curation policy' section
  async navigateToCurationPolicySection(): Promise<void> {
    console.log('Navigating to the Curation policy section...');
    await this.page.click('a.item:has-text("Curation policy")');
  }

  // Navigate to the 'About' section
  async navigateToAboutSection(): Promise<void> {
    console.log('Navigating to the About section...');
    await this.page.click('a.item:has-text("About")');
  }

  // Navigate to the 'Privileges' ('Settings' section)
  async navigateToPrivileges(): Promise<void> {
    console.log('Navigating to the Privileges...');
    await this.page.click('#privileges');
  }

  // Navigate to the 'Review policy' ('Settings' section)
  async navigateToReviewPolicy(): Promise<void> {
    console.log('Navigating to review policy...');
    await this.page.click('a#curation_policy.item[role="tab"]');
  }

  // Navigate to the 'Pages' ('Settings' section)
  async navigateToPages(): Promise<void> {
    console.log('Navigating to the Pages...');
    await this.page.click('#pages');
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

  // Method to fill in the 'Member' field ('Invite members' pop up dialog)
  async fillMember(): Promise<void> {
    const userEmail = testData.existingUserEmail;
    const memberFieldLocator = 'div.field:has-text("Member") div.ui.fluid.multiple.search.selection.dropdown';

    // Click the search icon within the 'Member' field to open the dropdown
    await this.page.click(`${memberFieldLocator} i.search.icon`);
    await this.page.waitForSelector(`${memberFieldLocator} input.search`, { state: 'visible' });

    // Fill in the user email in the input field
    const inputLocator = this.page.locator(`${memberFieldLocator} input.search`);
    await inputLocator.fill(userEmail);

    // Simulate pressing the Enter 
    await this.page.waitForTimeout(500);
    await inputLocator.press('Enter');
  }

  // Method to click the 'Curator' radio button
  async selectRoleByIndex(index: number): Promise<void> {
    // Construct the XPath dynamically using the provided index
    await this.page.locator(`(//div[@id="members-users-tab-panel"]//div[contains(@class, "checkbox")])[${index}]`).click();
  }

  // Method to fill in the 'Curation policy' field ('Settings' -> 'Pages' menu)
  async fillCurationPolicy(text: string): Promise<void> {
    // Locate the iframe that contains the rich text editor
    const iframeLocator = this.page.locator('(//div[@class="tox-edit-area"])[1]');
    await iframeLocator.waitFor({ state: 'visible' });

    // Switch to the iframe context using frameLocator
    const iframe = iframeLocator.frameLocator('iframe');

    // Locate the body inside the iframe and click to focus
    const bodyElement = iframe.locator('body');
    await bodyElement.click();

    // Fill the text into the body element
    await bodyElement.fill(text);

    console.log(`Filled the 'Curation policy' text area with: "${text}"`);
  }

  // Method to fill in the 'About page' field ('Settings' -> 'Pages' menu)
  async fillAboutPage(text: string): Promise<void> {
    // Locate the iframe that contains the rich text editor
    const iframeLocator = this.page.locator('(//div[@class="tox-edit-area"])[2]');
    await iframeLocator.waitFor({ state: 'visible' });

    // Switch to the iframe context using frameLocator
    const iframe = iframeLocator.frameLocator('iframe');

    // Locate the body inside the iframe and click to focus
    const bodyElement = iframe.locator('body');
    await bodyElement.click();

    // Fill the text into the body element
    await bodyElement.fill(text);

    console.log(`Filled the 'Curation policy' text area with: "${text}"`);
  }

  async getCommunityHeaderName(): Promise<string> {
    const headerElement = this.page.locator('h1.ui.medium.header.mb-0');
    const text = await headerElement.textContent();
    return text?.trim() ?? '';
  }

  // Method to select 'Role' from the dropdown menu 
  //(Roles must be defined directly in the test: Reader, Curator, Manager, Owner)
  async selectRoleOption(role: string): Promise<void> {
    const dropdown = this.page.locator('//div[@aria-label="Role owner"]');
    await dropdown.click();
    const dropdownOptions = this.page.locator('//div[@role="option"]//strong[text()="' + role + '"]');
    await dropdownOptions.waitFor({ state: 'visible' });
    await dropdownOptions.click();
  }

  // Method to select 'Visibility' from the dropdown menu 
  // Visibility must be defined directly in the test: Public, Hidden
  async selectVisibilityOption(role: string): Promise<void> {
    await this.page.locator('//div[@aria-label="Visibility Hidden" or @aria-label="Visibility Public"]').click();
    await this.page.locator(`//div[@role="option"]//strong[text()="${role}"]`).click();
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

  // Method to click the 'Invite...' button ('Members' section)
  async clickInviteButton(): Promise<void> {
    await this.page.click('button.ui.tiny.compact.fluid.icon.positive.left.labeled');
  }

  // Method to click the 'Invite' button ('Invite members' pop up dialog)
  async clickInviteButtonConfirmation() {
    await this.page.locator('button.ui.icon.primary.left.labeled.button:has-text("Invite")').click();
  }

  // Method to click the 'Invitations' button ('Members' section)
  async clickInvitationsSection() {
    await this.page.locator('div.ui.vertical.menu a.item').nth(1).click();
  }

  // Method to click the 'Leave...' button ('Members' section)
  async clickLeaveButton(): Promise<void> {
    const leaveButton = this.page.locator('button.ui.tiny.compact.fluid.icon.negative.left.labeled.button');
    await leaveButton.click();
  }

  // Method to click the 'Remove...' button ('Members' section)
  async clickRemoveButton(): Promise<void> {
    const removeButton = this.page.locator('button.ui.tiny.compact.fluid.icon.left.labeled.button:has-text("Remove...")');
    await removeButton.click();
  }

  // Method to click a confirmation 'Leave...' button ('Leave community' pop up dialog)
  async clickLeaveButtonConfirm(index: number): Promise<void> {
    const leaveButton = this.page.locator(`(//button[contains(@class, 'ui icon negative left labeled button')])[${index}]`);
    await leaveButton.click();
  }

  // Method to click a confirmation 'Remove...' button ('Remove user' pop up dialog)
  async clickRemoveButtonConfirm(index: number): Promise<void> {
    const leaveButton = this.page.locator(`(//button[contains(@class, 'ui icon negative left labeled button')])[${index}]`);
    await leaveButton.click();
  }

  // Method to click the 'Restricted' radio button ('Community visibility' section / 1 = 'Public', 2 = 'Restricted')
  async clickRestrictedRadioButton(index: number): Promise<void> {
    const restrictedRadioButton = this.page.locator(`(//label[@for="access.visibility"])[${index}]`);
    await restrictedRadioButton.click();
  }

   // Method to click the 'Submission review policy' radio button ('Settings' section -> 'Review Policy' / 1 = 'Review all submissions', 2 = 'Allow curators...')
   async clickSubmissionReviewPolicyRadioButton(index: number): Promise<void> {
    const restrictedRadioButton = this.page.locator(`(//label[@for="access.review_policy"])[${index}]`);
    await restrictedRadioButton.click();
  }

  // Method to click the 'Save' button ('Settings' -> 'Privileges' section)
  async clickSaveButtonPrivileges(): Promise<void> {
    const saveButton = this.page.locator('button.ui.icon.primary.toggle.left.labeled.button');
    await saveButton.click();
  }

  // Method to click the 'Save' button ('Settings' -> 'Pages' section)
  async clickSaveButtonPages(): Promise<void> {
    const saveButton = this.page.locator('//button[@type="submit"]');
    await saveButton.click();
  }

  // Method to click 'View all versions' slider ('Records' section -> 'Versions')
  async clickViewAllVersions() {
    await this.page.locator('label:text("View all versions")').nth(1).click(); 
  }

  // Method to click the 'Embargoed' checkbox ('Records' section -> 'Access status')
  // Specify checkbox name directly in the test: Embargoed, Metadata-only. Open
  async clickAccessStatusCheckbox(accessStatus: string) {
    const checkboxLocator = `(//input[@aria-label="${accessStatus}"]/ancestor::div[contains(@class,"checkbox")])[2]`;
    await this.page.locator(checkboxLocator).click();
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
    await allDone.waitFor({ state: 'visible', timeout: 5000 });
    const isHeaderVisible = await allDone.isVisible();
    expect(isHeaderVisible).toBe(true);
    console.log('Verified the request was successfully accepted and "All done!" is visible.');
  }

  // Method to verify that the verified closed request exists (record was accepted and is in 'Closed' list)
  async verifyClosedResultsFound() {
    const resultsLocator = this.page.locator('div.four.wide.column:has-text("1 results found")');
    await resultsLocator.waitFor({ state: 'visible', timeout: 5000 });
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
  
    // Wait for the restricted label to be present
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
        console.log('Verified: The "Restricted" record is not present');
        return isVisible;
    } catch (error) {
        console.log('The "Restricted" record is present');
        return false;
    }
  }

  // Method to verify if the invited member is present in the Invitations list
  async verifyCommunityMemberIsPresent(existingUserEmail: string): Promise<boolean> {
    const memberLocator = this.page.locator(`tr.community-member-item >> text=${existingUserEmail}`);
    const isVisible = await memberLocator.isVisible();
    return isVisible;
  }

  // Method to check if the 'You' label is present (Communities -> Members)
  async isYouLabelPresent(): Promise<boolean> {
    const youLabel = this.page.locator('div.ui.tiny.label.primary', { hasText: 'You' });
    await youLabel.waitFor({ state: 'visible' });
    return await youLabel.isVisible();
  }

  // Method to verify if the text in 'Curation policy' section is present
  async verifyCurationPolicyText(): Promise<string> {
    const curationPolicyDiv = this.page.locator('.ui.text.container.rich-input-content.rel-m-2.rel-pt-1');
    await curationPolicyDiv.waitFor({ state: 'visible' });
        const textContent = await curationPolicyDiv.locator('p').textContent();
    if (textContent === null) {
      throw new Error('Curation policy text content is null or not found.');
    }
    return textContent;
  }

  // Method to verify if the text in 'About' section is present
  async verifyAboutText(): Promise<string> {
    const curationPolicyDiv = this.page.locator('.ui.text.container.rel-m-2.rel-pt-1');
    await curationPolicyDiv.waitFor({ state: 'visible' });
        const textContent = await curationPolicyDiv.locator('p').textContent();
    if (textContent === null) {
      throw new Error('About page text content is null or not found.');
    }
    return textContent;
  }

  // Method to verify if the "This community has no public members. " message is present (verification after Leave community)
  async verifyLeaveCommunity(): Promise<boolean> {
    const messageLocator = this.page.locator('//div[@class="ui placeholder center aligned segment"]');
    await messageLocator.waitFor({ state: 'visible' });
    return await messageLocator.isVisible();
  }

  // Method to verify if the 'Remove...' button is NOT present (verification after Remove user from the community)
  async verifyRemoveUser(): Promise<boolean> {
    const buttonLocator = this.page.locator('button.ui.tiny.compact.fluid.icon.left.labeled.button:has-text("Remove...")');
    const buttonCount = await buttonLocator.count();
    return buttonCount === 0;
  }

  // Method to verify that the 'recordManagement' menu is no present (actions 'Edit', 'New version', 'Share')
  async verifyRecordManagementNotPresent(): Promise<boolean> {
    const recordManagementLocator = this.page.locator('//div[@id="recordManagement"]');
    const elementCount = await recordManagementLocator.count();
    return elementCount === 0;
  }

  // Method to verify that the 'recordManagement' menu is present
  async verifyRecordManagementPresent(): Promise<boolean> {
    const recordManagementLocator = this.page.locator('//div[@id="recordManagement"]');
    await recordManagementLocator.waitFor({ state: 'visible', timeout: 5000 });
    const elementCount = await recordManagementLocator.count();
    return elementCount > 0;
  }

  // Method to verify if role is set to 'Manager'
  async verifyRoleIsManager(index: number = 0): Promise<void> {
    const dropdownContainer = this.page.locator('//div[@aria-label="Role manager"]');
    await dropdownContainer.waitFor({ state: 'attached' });
  
    // Locate all role elements within the dropdown using XPath
    const roleElements = dropdownContainer.locator(`xpath=./div[text()="Manager"]`);
    // Ensure the specified index exists
    const count = await roleElements.count();
    if (index >= count) {
      throw new Error(`Role "Manager" not found at index ${index}. Total roles available: ${count}.`);
    }
    // Target the specific role element by index
    const roleToVerify = roleElements.nth(index);
    await roleToVerify.waitFor({ state: 'visible' });
  
    // Verify the role text is "Manager"
    const roleText = await roleToVerify.textContent();
    if (roleText?.trim() !== 'Manager') {
      throw new Error(`The role at index ${index} is not set to "Manager". Found: "${roleText}".`);
    }
    console.log(`Successfully verified the role "Manager" at index ${index}.`);
  }

  // Method to verify if the a member is visible in the 'Members' section
  async verifyMemberIsPresent(timeout: number = 5000): Promise<boolean> {
    const userProfileLocator = this.page.locator('//div[@class="item flex"]');
  
    try {
      // Wait for the locator to be visible within the specified timeout
      await userProfileLocator.first().waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  // Method to verify if the 'Members' section is empty (Community member was set as 'Hidden' for the public)
  async verifyMemberIsNotPresent(timeout: number = 5000): Promise<boolean> {
  const noMembersMessageLocator = this.page.locator('.ui.placeholder.center.aligned.segment');
  
    try {
      // Wait for the component to be visible within the specified timeout
      await noMembersMessageLocator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  // Methods to check found results with 'Versions' (View all versions) slider switched off ('Records' section)
  async isNumberPresent(expectedNumber: number): Promise<boolean> {
    const labelLocator = this.page.locator('//div[@class="ui label"]');
    await labelLocator.waitFor({ state: 'visible', timeout: 5000 });
    const textContent = await labelLocator.textContent();
    
    // Debugging output
    console.log(`Label text content: '${textContent?.trim()}'`);
  
    // Ensure the number is present and it matches the expected value
    if (textContent?.trim() === expectedNumber.toString()) {
      return true;
    }
    return false;  // Return false if it doesn't match
  }

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}