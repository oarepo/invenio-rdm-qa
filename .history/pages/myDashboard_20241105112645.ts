import { Page, expect } from '@playwright/test';
import { FileUploadHelper } from '../helpers/fileUploadHelper';
import { UIHelper } from '../helpers/uiHelper';
import { urls } from '../data/urls';
import { testData } from '../data/testData';

export class MyDashboard {
  private fileUploadHelper: FileUploadHelper;
  private uiHelper: UIHelper;
  public uploadedTitle: string;

  constructor(private page: Page) {
    this.fileUploadHelper = new FileUploadHelper(page);
    this.uiHelper = new UIHelper(page);
    this.uploadedTitle = testData.upload.recordTitle();
  }

// -------------------------------------------------------------------------------------
//  UPLOADS
// -------------------------------------------------------------------------------------

// NAVIGATION --------------------------------------------------------------------------

  // Navigate to the homepage page using the helper
  async navigateToHome() {
    await this.uiHelper.navigateToHome();
  }

  // Navigate to the new upload section using the generic goto helper
  async navigateToUploadSection() {
    await this.uiHelper.goto(urls.newUploadURL); 
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



// BUTTONS -----------------------------------------------------------------------------

  // Method to click 'Edit' button in first record in the list
  async clickEdit() {
    await this.page.locator('(//button[contains(@class, "ui small compact icon right floated left labeled button") and .//text()="Edit"])[1]');
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method to verify the success message
  async verifySuccessMessage(message: string) {
    await this.page.waitForSelector(`text=${message}`);
  }

  // Method to verify the success save draft message
  async verifySaveDraftMessage() {
    const successMessage = this.page.locator('div.left.aligned.fifteen.wide.column >> strong');
    await expect(successMessage).toHaveText('Record successfully saved.');
  }

  // Method to verify the save draft messages in 'Preview'
  async verifySaveDraftPreview() {
    const successMessage = this.page.locator('div.ui.info.flashed.bottom.attached.manage.message');
    await expect(successMessage).toHaveText('Preview You are previewing a new record that has not yet been published.');
  }

  async verifySaveDraftPreviewVersions() {
    const successMessage = this.page.locator('div.ui.info.message.no-border-radius.m-0');
    await expect(successMessage).toHaveText('PreviewOnly published versions are displayed.');
  }

  // Method to retrieve the description of the uploaded record
  async getRecordDescription(): Promise<string> {
    return await this.page.locator('#description > div').innerText();
  }
  
  // Method to retrieve the title of the uploaded record
  async getRecordTitle(): Promise<string> {
    return await this.page.locator('#record-title').innerText();
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

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}