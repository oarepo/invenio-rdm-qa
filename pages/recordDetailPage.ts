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

  // Method to retrieve the record name and return it
  async getRecordTitle(): Promise<string> {
    const recordTitle = await this.page.locator('#record-title').textContent();
    if (recordTitle) {
      console.log(`Record title retrieved: ${recordTitle.trim()}`);
      return recordTitle.trim();
    } else {
      throw new Error('Record title element is empty or not found.');
    }
  }

  // Get the citation text ('Citation' section)
  async getCitationText(): Promise<string> {
    const citationLocator = this.page.locator('//div[@id="citation-text"]/div[text()]');
    return (await citationLocator.textContent())?.trim() || '';
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
    // You can similarly define the 'Download all' button if it exists
    const downloadAllButton = await this.page.locator('//th/a[@role="button"][contains(@class,"archive-link")]');
    await downloadAllButton.click();
    console.log('Download all button clicked');
  }

  // Method to click the 'Preview' button
  async clickPreview() {
    const previewButton = await this.page.locator('//span/a[@role="button"][contains(@class,"preview-link")]');
    await previewButton.click();
    console.log('Preview button clicked');
  }

  // Method to click the 'Download' button
  async clickDownload() {
    const downloadButton = await this.page.locator('//span/a[@role="button"][not(contains(@class,"preview"))]');
    await downloadButton.click();
    console.log('Download button clicked');
  }

  // Method to choose 'Style' from pull down list ('Citation' section) - (in test specify: Harvard, APA, IEEE)
  async selectCitationStyle(style: string): Promise<void> {
    // Click the dropdown to open the options
    const dropdown = this.page.locator('.ui.selection.dropdown.citation-dropdown');
    await dropdown.click();

    // Locate the dropdown option by text and click it
    const option = this.page.locator(`.menu .item:has-text("${style}")`);
    await option.click();

    // Verify the selected style is displayed
    await this.page.waitForSelector(`.ui.selection.dropdown.citation-dropdown .divider.text:has-text("${style}")`);
  }

  // Method to choose file format from pull down list ('Export' section) - (in test specify: JSON, JSON-LD, DCAT, DataCite JSON)
  async selectFileFormat(style: string): Promise<void> {
    // Click the dropdown icon directly to expand the menu
    const dropdownIcon = this.page.locator('//div[@aria-label="Export selection"]');
    await dropdownIcon.click();
  
    // Wait for the dropdown menu to be visible
    const menu = this.page.locator('//div[@aria-label="Export selection"][@aria-expanded="true"]');
    await menu.waitFor({ state: 'visible' });
  
    // Locate the desired option and click it
    const option = menu.locator(`.item span.text`, { hasText: new RegExp(`^${style}$`) });
    await option.click();
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
    try {
      await accessStatusSection.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
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

  // Method to check the presence of the preview container and iframe
  async isPreviewContainerVisible(): Promise<boolean> {
    const containerLocator = this.page.locator('div#files-preview-accordion-panel.active.content.preview-container.open');
    return await containerLocator.isVisible();
  }

  // Method to check if the iframe exists inside the container
  async isPreviewIframeInsideContainer(): Promise<boolean> {
    const iframeInContainerLocator = this.page.locator(
      'div#files-preview-accordion-panel iframe#preview-iframe'
    );
    return await iframeInContainerLocator.isVisible();
  }

  // Validate the citation format using regex
  validateCitationFormat(citation: string, regex: RegExp): boolean {
    return regex.test(citation);
  }

  // Method to check actual selected 'Style' ('Citation' section)
  async getSelectedStyle(): Promise<string> {
    return this.page.locator('.ui.selection.dropdown.citation-dropdown .divider.text').innerText();
  }

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}