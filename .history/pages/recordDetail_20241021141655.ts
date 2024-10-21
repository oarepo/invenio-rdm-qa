import { Page } from '@playwright/test';
import { FileUploadHelper } from '../helpers/fileUploadHelper';
import { UIHelper } from '../helpers/uiHelper';
import { urls } from '../data/urls';
import { testData } from '../data/testData';

export class RecordDetail {
  private fileUploadHelper: FileUploadHelper;
  private uiHelper: UIHelper;
  public uploadedTitle: string;

  constructor(private page: Page) {
    this.fileUploadHelper = new FileUploadHelper(page);
    this.uiHelper = new UIHelper(page);
    this.uploadedTitle = testData.upload.recordTitle();
  }

// NAVIGATION --------------------------------------------------------------------------

  // Method to navigate directly to the homepage
  async navigateToHome() {
    await this.page.goto(urls.baseURL);
    await this.page.waitForURL(urls.baseURL);
  }

  // Method to navigate directly to the new upload section
  async navigateToUploadSection() {
    await this.page.goto(urls.newUploadURL);
    await this.page.waitForURL(urls.newUploadURL);
  }

  // Method to navigate to the My Dashboard page
  async navigateToMyDashboard() {
    await this.page.getByRole('link', { name: 'My dashboard' }).click();
  }

  // Method to navigate to the detail of a first record
  async firstRecordDetail() {
    await this.page.waitForSelector('//a[contains(@href, "/records/")][1]', { state: 'visible' });
    await this.page.click('//a[contains(@href, "/records/")][1]');
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click the 'Edit' button
  async clickEdit() {
    await this.page.click('#recordManagement > div > div:nth-child(1) > button');
  }

  // TRY THIS 
  async clickEdit2() {
    await this.page.getByRole('button', { name: 'Edit' }).click(); // Adjust 'Edit' to the appropriate button name
  }

  // Method to click the 'New version' button
  async clickNewVersion() {
    await this.page.click('#recordManagement > div > div:nth-child(2) > span > button');
  }

  // TRY THIS 
  async clickNewVersion2() {
    await this.page.getByRole('button', { name: 'New version' }).click();
  }

  // Method to click the 'Share' button
  async clickShareButtonInRecordManagement() {
    await this.page.click('//div[@id="recordManagement"]//button[contains(@class, "ui") and contains(text(), "Share")]');
  }


// VERIFICATION ------------------------------------------------------------------------

  // Method to verify the success message
  async verifySuccessMessage(message: string) {
    await this.page.waitForSelector(`text=${message}`);
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