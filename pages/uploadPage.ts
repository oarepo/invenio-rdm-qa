import { Page } from '@playwright/test';
import { FileUploadHelper } from '../helpers/fileUploadHelper';
import { UIHelper } from '../helpers/uiHelper';
import { urls } from '../data/urls'; 

export class UploadPage {
  private fileUploadHelper: FileUploadHelper;
  private uiHelper: UIHelper;

  constructor(private page: Page) {
    this.fileUploadHelper = new FileUploadHelper(page);
    this.uiHelper = new UIHelper(page);
  }

  // Method to navigate directly to the upload section using the newUploadURL
  async navigateToUploadSection() {
    await this.page.goto(urls.newUploadURL);
    await this.page.waitForURL(urls.newUploadURL);
  }

  // Method to fill the record title
  async fillTitle(title: string) {
    await this.page.fill('input[id="metadata.title"]', title);
  }

  // Method to fill the record description
  async fillDescription(description: string) {
    await this.page.fill('textarea[name="description"]', description);
  }

  // Method to fill family name (or creator name) and confirm the dialog
  async fillFamilyName(familyName: string) {
  // Click the "Add creator" button using its text
    await this.page.getByRole('button', { name: 'Add creator' }).click();

  // Wait for the pop-up dialog to appear (adjust the selector based on your application)
    await this.page.waitForSelector('input[placeholder="Family name"]');

  // Fill in the family name
    await this.page.fill('input[placeholder="Family name"]', familyName);

  // Click the "Save" button to confirm the dialog
  await this.page.click('body > div.ui.top.aligned.page.modals.dimmer.transition.visible.active > div > div.actions > button:nth-child(3)');
  }

  // Method to select DOI option
  async selectDOIOption(isDOIRequired: boolean) {
    await this.page.click('input[type="radio"][value="no"]');

    if (isDOIRequired) {
      await this.page.waitForSelector('text="Get a DOI now!"');
      await this.page.click('text="Get a DOI now!"');
    }
  }

   // Method to click the dropdown for selecting resource type
   async clickResourceTypeDropdown() {
    await this.page.click('#rdm-deposit-form .required.field.invenio-select-field > div');
  }

  // Method to select resource type
  async selectResourceType(resourceType: string) {
    await this.page.click('text="Resource type"');
    await this.page.click(`text=${resourceType}`);
  }

  // Method to upload a random file from the UploadFiles folder
  async uploadFile(filePath: string) {
    await this.page.setInputFiles('input[type="file"]', filePath);
  }

  // Method to click Save button
  async clickSave() {
    await this.uiHelper.clickButtonByText('Save');
  }

  // Method to click Publish button
  async clickPublish() {
    await this.uiHelper.clickButtonByText('Publish');
  }

  // Method to verify the success message
  async verifySuccessMessage(message: string) {
    await this.page.waitForSelector(`text=${message}`);
  }
}