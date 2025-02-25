import { expect, Page } from '@playwright/test';
import { FileUploadHelper } from '../helpers/fileUploadHelper';
import { UIHelper } from '../helpers/uiHelper';
import { urls } from '../data/urls';
import { testData } from '../data/testData';

export class UploadPage {
  private fileUploadHelper: FileUploadHelper;
  private uiHelper: UIHelper;
  public uploadedTitle: string;

  constructor(private page: Page) {
    this.fileUploadHelper = new FileUploadHelper(page);
    this.uiHelper = new UIHelper(page);
    this.uploadedTitle = testData.upload.recordTitle();
  }

  // Method to navigate directly to the upload section
  async navigateToUploadSection() {
    await this.page.goto(urls.newUploadURL);
    await this.page.waitForURL(urls.newUploadURL);
    expect(this.page.url()).toContain('https://inveniordm.web.cern.ch/uploads/new'); // Adjust the URL as needed

  }

  // Method to fill the record title
  async fillTitle(title: string) {
    this.uploadedTitle = title; // Store the title here
    await this.page.fill('input[id="metadata.title"]', title);
  }

  // Method to fill family name (or creator name) and confirm the dialog
  async fillFamilyName(familyName: string) {
    // Click the "Add creator" button
    await this.page.getByRole('button', { name: 'Add creator' }).click();

    // Wait for the pop-up dialog to appear
    await this.page.waitForSelector('input[placeholder="Family name"]');

    // Fill in the family name
    await this.page.fill('input[placeholder="Family name"]', familyName);

    // Click the "Save" button to confirm the dialog
    await this.page.click('body > div.ui.top.aligned.page.modals.dimmer.transition.visible.active > div > div.actions > button:nth-child(3)');
  }

  // Method to select DOI option
  async selectDOIOption(isDOIRequired: boolean) {
    await this.page.getByText('No', { exact: true }).first().click();

    if (isDOIRequired) {
      await this.page.waitForSelector('text="Get a DOI now!"');
      await this.page.click('text="Get a DOI now!"');
    }
  }
/*
  // Method to click the dropdown for selecting resource type
  async clickResourceTypeDropdown() {
    await this.page.waitForSelector('#rdm-deposit-form .required.field.invenio-select-field > div', { state: 'visible' });
    await this.page.click('#rdm-deposit-form .required.field.invenio-select-field > div');
  }
*/

  // Method to select the first element from the specified navigator (there are 5 the same) = indexing
  async selectFirstResourceType() {
    const firstElement = this.page.locator('#rdm-deposit-form .required.field.invenio-select-field > div').first();
    await firstElement.click(); // Or any other action you want to perform
  }

  // Method to select resource type
  async selectResourceType(currentlySelected: string | null) {
    const randomResourceType = testData.upload.resourceType(currentlySelected);
    await this.page.waitForTimeout(500);
    await this.page.click('#rdm-deposit-form .required.field.invenio-select-field > div');
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: randomResourceType, exact: true }).click();
  }

  // Method to change resource type
  async changeResourceType(currentlySelected: string | null) {
    const changeResourceType = testData.upload.resourceType(currentlySelected);
    await this.page.waitForTimeout(1000);
    await this.page.click('#rdm-deposit-form .required.field.invenio-select-field > div');
    await this.page.getByRole('option', { name: changeResourceType, exact: true }).click();
  }

  // Method to click Save button
  async clickSave() {
    await this.uiHelper.clickButtonByText('Save');
  }

  // Method to click Publish button
  async clickPublish() {
    await this.page.click('button:has-text("Publish")');
  }

  // Method to click Edit button
  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
  }

  // Method to fill the description in the iframe
  async fillDescription(description: string) {
    const iframeElement = this.page.frameLocator('iframe[id^="tiny-react"]'); // Flexible selector for the iframe (ID starting with 'tiny-react')
    const body = iframeElement.first().locator('body#tinymce'); // Select the first iframe (if there are multiple) and then locate the body element inside the iframe
    await body.fill(description);
  }

  // Method to verify the success message
  async verifySuccessMessage(message: string) {
    await this.page.waitForSelector(`text=${message}`);
  }

  // Method for implicit waiting (5 seconds)
  async waitForFiveSeconds() {
    await this.page.waitForTimeout(5000); // Waits for 5 seconds
  }

  // Method to upload a random file using the helper
  async uploadRandomFile() {
    await this.fileUploadHelper.uploadRandomFile();
  }

  // Method to click the Publish button on the confirmation dialog
  async clickPublishOnConfirmation() {
    await this.page.waitForTimeout(500);
    // Wait for the modal to be visible
    const modalSelector = 'div.ui.small.modal.transition.visible.active';
    await this.page.waitForSelector(modalSelector, { state: 'visible' });

    // Wait for the Publish button to be visible
    const publishButtonSelector = `${modalSelector} button.ui.positive.button`;
    const publishButton = await this.page.waitForSelector(publishButtonSelector, { state: 'visible' });

    // Log before clicking for debugging
    console.log('Clicking the Publish button...');

    // Click the Publish button
    await publishButton.click();
  }

  // Method to check if the record exists after publishing
  async checkRecordExists() {
    // Wait for the record title to be visible on the detail page
    await this.page.waitForSelector('#record-title', { state: 'visible', timeout: 10000 });

    // Get the title text from the element
    const titleText = await this.page.textContent('#record-title');

    // Check if the title matches the uploaded title
    if (titleText?.trim() === this.uploadedTitle) {
      console.log(`Record with title "${this.uploadedTitle}" exists.`);
      return true;
    } else {
      console.error(`Expected title "${this.uploadedTitle}", but found "${titleText?.trim()}".`);
      return false;
    }
  }
}