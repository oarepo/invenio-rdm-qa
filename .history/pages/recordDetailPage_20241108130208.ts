import { Page } from '@playwright/test';
import { testData } from '../data/testData';
import { UIHelper } from '../helpers/uiHelper';

export class RecordDetail {
  public uploadedTitle: string;
  private uiHelper: UIHelper;

  constructor(private page: Page) {
    this.uploadedTitle = testData.upload.recordTitle();
    this.uiHelper = new UIHelper(page);
  }

// NAVIGATION --------------------------------------------------------------------------

   // Navigate to the homepage page using the helper
   async navigateToHome() {
    await this.uiHelper.navigateToHome();
  }

  // Navigate to the 'My Dashboard' page using the helper
  async navigateToMyDashboard() {
    await this.uiHelper.navigateToMyDashboard();
  }

  // Navigate to the detail of the first record using the helper
  async firstRecordDetail() {
    await this.uiHelper.firstRecordDetail();
  }

  // Method to click the 'Version v1' link (in 'Versions' section)
  async clickVersionV1() {
    await this.page.locator('div.item a.text-break:has-text("Version v1")').click();
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

  // Method to check if 'Version v2' item is present on the page
  async isVersionV2Present(): Promise<boolean> {
    const versionItemLocator = this.page.locator('div.item.version.active >> div.left.floated.content >> span.text-break:text("Version v2")');
    const isVisible = await versionItemLocator.isVisible();
    return isVisible;
  }
}