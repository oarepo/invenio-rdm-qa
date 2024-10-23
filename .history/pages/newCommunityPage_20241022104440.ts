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

  // Method to navigate directly to the communities
  async navigateToCommunities() {
    await this.page.goto(urls.communitiesURL);
    await this.page.waitForURL(urls.communitiesURL);
  }

  // Method to navigate to the My Dashboard page
  async navigateToMyDashboard() {
    await this.page.getByRole('link', { name: 'My dashboard' }).click();
  }

  // Method to navigate to the detail of the first record
  async firstRecordDetail() {
    await this.page.waitForSelector('//a[contains(@href, "/records/")][1]', { state: 'visible' });
    await this.page.click('//a[contains(@href, "/records/")][1]');
  }

// FIELDS ------------------------------------------------------------------------------  

  // Method to click the 'Style' dropdown and select a style
  async selectStyle(style: string) {
    await this.page.getByLabel('Style').locator('i').click();
    await this.page.getByText(style).click();
  }

  // Method to select the export option
  async selectExportOption(option: string) {
    await this.page.getByRole('option', { name: option }).dblclick();
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click the 'Edit' button
  async clickEdit() {
    await this.page.click('#recordManagement > div > div:nth-child(1) > button');
  }

  // Method to click the 'Edit' button (alternative approach)
  async clickEdit2() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
  }

  // Method to click the 'New version' button
  async clickNewVersion() {
    await this.page.click('#recordManagement > div > div:nth-child(2) > span > button');
  }

  // Method to click the 'New version' button (alternative approach)
  async clickNewVersion2() {
    await this.page.getByRole('button', { name: 'New version' }).click();
  }

  // Method to click the 'Share' button
  async clickShare() {
    await this.page.click('//div[@id="recordManagement"]//button[contains(@class, "ui") and contains(text(), "Share")]');
  }

  // Method to click the 'Share' button (alternative approach)
  async clickShare2() {
    await this.page.getByRole('button', { name: 'Share' }).click();
  }

   // Method to click the 'Export selection' button
   async clickExportSelection() {
    await this.page.getByLabel('Export selection').locator('i').click();
  }

   // Method to click the 'Export' button and wait for the download
   async clickExportButton() {
    const downloadPromise = this.page.waitForEvent('download');
    await this.page.getByRole('button', { name: 'Export' }).click();
    return downloadPromise;
  } 

  // Method to click the 'Download all' button
  async clickDownloadAll() {
    await this.page.getByRole('link', { name: 'Download all' }).click();
  }

  // Method to click the 'Preview' button
  async clickPreview() {
    await this.page.getByRole('link', { name: 'Preview' }).click();
  }

  // Method to click the 'Download' button
  async clickDownload() {
    await this.page.getByRole('link', { name: 'Download' }).click();
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}