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
    console.log('Navigating to the homepage...');
    await this.uiHelper.navigateToHome();
  }

  // Navigate to the 'My Dashboard' page using the helper
  async navigateToMyDashboard() {
    console.log('Navigating to "My Dashboard" page...');
    await this.uiHelper.navigateToMyDashboard();
  }

  // Navigate to the detail of the first record using the helper
  async firstRecordDetail() {
    console.log('Navigating to the first record detail page...');
    await this.uiHelper.firstRecordDetail();
  }

  // Method to click the 'Version v1' link (in 'Versions' section)
  async clickVersionV1() {
    console.log('Navigating to "Version v1"...');
    await this.page.locator('div.item a.text-break:has-text("Version v1")').click();
  }

// FIELDS ------------------------------------------------------------------------------  

  // Method to click the 'Style' dropdown and select a style
  async selectStyle(style: string) {
    const styleDropdown = this.page.getByLabel('Style').locator('i');
    await styleDropdown.waitFor({ state: 'visible' });
    await styleDropdown.click();

    const styleOption = this.page.getByText(style);
    await styleOption.waitFor({ state: 'visible' });
    await styleOption.click();
  }

  // Method to select the export option
  async selectExportOption(option: string) {
    const exportOption = this.page.getByRole('option', { name: option });
    await exportOption.waitFor({ state: 'visible' });
    await exportOption.dblclick();
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click the 'Edit' button
  async clickEdit() {
    const editButton = this.page.locator('#recordManagement > div > div:nth-child(1) > button');
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  // Method to click the 'Edit' button (alternative approach)
  async clickEdit2() {
    const editButton = this.page.getByRole('button', { name: 'Edit' });
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
  }

  // Method to click the 'New version' button
  async clickNewVersion() {
    const newVersionButton = this.page.locator('#recordManagement > div > div:nth-child(2) > span > button');
    await newVersionButton.waitFor({ state: 'visible' });
    await newVersionButton.click();
  }

  // Method to click the 'New version' button (alternative approach)
  async clickNewVersion2() {
    const newVersionButton = this.page.getByRole('button', { name: 'New version' });
    await newVersionButton.waitFor({ state: 'visible' });
    await newVersionButton.click();
  }

  // Method to click the 'Share' button
  async clickShare() {
    const shareButton = this.page.locator('//div[@id="recordManagement"]//button[contains(@class, "ui") and contains(text(), "Share")]');
    await shareButton.waitFor({ state: 'visible' });
    await shareButton.click();
  }

  // Method to click the 'Share' button (alternative approach)
  async clickShare2() {
    const shareButton = this.page.getByRole('button', { name: 'Share' });
    await shareButton.waitFor({ state: 'visible' });
    await shareButton.click();
  }

  // Method to click the 'Export selection' button
  async clickExportSelection() {
    const exportSelectionButton = this.page.getByLabel('Export selection').locator('i');
    await exportSelectionButton.waitFor({ state: 'visible' });
    await exportSelectionButton.click();
  }

  // Method to click the 'Export' button and wait for the download
  async clickExportButton() {
    const exportButton = this.page.getByRole('button', { name: 'Export' });
    await exportButton.waitFor({ state: 'visible' });
    const downloadPromise = this.page.waitForEvent('download');
    await exportButton.click();
    return downloadPromise; 
  } 

  // Method to click the 'Download all' button
  async clickDownloadAll() {
    const downloadAllLink = this.page.getByRole('link', { name: 'Download all' });
    await downloadAllLink.waitFor({ state: 'visible' });
    await downloadAllLink.click();
  }

  // Method to click the 'Preview' button
  async clickPreview() {
    const previewLink = this.page.getByRole('link', { name: 'Preview' });
    await previewLink.waitFor({ state: 'visible' });
    await previewLink.click();
  }

  // Method to click the 'Download' button
  async clickDownload() {
    const downloadLink = this.page.getByRole('link', { name: 'Download' });
    await downloadLink.waitFor({ state: 'visible' });
    await downloadLink.click();
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method to check if 'Version v2' item is present on the page
  async isVersionV2Present(): Promise<boolean> {
    const versionItem = this.page.locator('div.item.version.active >> div.left.floated.content >> span.text-break:text("Version v2")');
    await versionItem.waitFor({ state: 'visible' });
    const isVisible = await versionItem.isVisible();
    return isVisible;
  }

  // Method to check if the 'Version v1' label is present
  async isVersionV1Present(): Promise<boolean> {
    const versionLabel = this.page.locator('span.label.text-muted', { hasText: ' | Version v1' });
    await versionLabel.waitFor({ state: 'visible' });
    const isVisible = await versionLabel.isVisible();
    return isVisible;
  }

  // Method to check if the 'Embargoed' status label is present
  async isEmbargoedLabelPresent(): Promise<boolean> {
    const embargoedTag = this.page.locator('span.ui.label.horizontal.small.access-status.embargoed.mb-5');
    return await embargoedTag.isVisible();
  }

  // Method to check if the "Embargoed Status" section is present
  async isEmbargoedStatusSectionPresent(): Promise<boolean> {
    const embargoedStatus = this.page.locator('section#record-access-status.ui.warning.message.rel-mt-1');
    return await embargoedStatus.isVisible();
  }

  // Method to check if the 'Restricted' status label is present
  async isRestrictedLabelPresent(timeout: number = 10000): Promise<boolean> {
    const restrictedTag = this.page.locator('span.ui.label.horizontal.small.access-status.restricted.mb-5');

    try {
        // Wait for the restricted tag to be visible within the provided timeout
        await restrictedTag.waitFor({ state: 'visible', timeout });

        // Return true if the restricted tag is visible
        return true;
    } catch (error) {
        // Return false if the restricted tag is not visible within the timeout
        console.error(`Restricted status label not found within ${timeout} ms: ${error.message}`);
        return false;
    }
  }

  // Method to check if the "Record Access Status" section is present
  async isRecordAccessStatusSectionPresent(): Promise<boolean> {
    const accessStatusSection = this.page.locator('section#record-access-status.ui.negative.message.rel-mt-1');
    return await accessStatusSection.isVisible();
  }

  // Method to check if the message exists on the page (The record is publicly accessible, but files are restricted to users with access.)
  async checkRestrictedMessagePresence(timeout: number = 10000): Promise<boolean> {
    const restrictedMessage = this.page.locator('div.ui.negative.message.file-box-message');

    try {
        // Wait for the message to be visible within the provided timeout
        await restrictedMessage.waitFor({ state: 'visible', timeout });

        return true;
    } catch (error) {
        console.error(`Restricted message not found within ${timeout} ms: ${error.message}`);
        return false;
      }
  }

  // Method to check if the 'You' label is present (Communities -> Members)
  async isYouLabelPresent(): Promise<boolean> {
    const youLabel = this.page.locator('div.ui.tiny.label.primary', { hasText: 'You' });
    await youLabel.waitFor({ state: 'visible' });
    return await youLabel.isVisible();
  }

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}