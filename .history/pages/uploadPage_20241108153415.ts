import { Page, expect } from '@playwright/test';
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

  // Method to check 'Metadata-only record' checkbox
  async checkFirstMetadataOnlyCheckbox() {
    await this.page.click('(//div[contains(@class, "ui checkbox")])[1]//input[@type="checkbox"]');
  }

   // Method to upload a random file using the helper
   async uploadRandomFile() {
    await this.fileUploadHelper.uploadRandomFile();
  }

  // Method to fill the record 'Title'
  async fillTitle(title: string) {
    this.uploadedTitle = title; // Store the title here
    await this.page.fill('input[id="metadata.title"]', title);
  }

  // Method to fill 'Family name' (or 'Creators' name) and confirm the dialog
  async fillFamilyName(familyName: string) {
    // Click the 'Add creator' button
    await this.page.getByRole('button', { name: 'Add creator' }).click();

    // Wait for the pop-up dialog to appear
    await this.page.waitForSelector('input[placeholder="Family name"]');

    // Fill in the 'Family name'
    await this.page.fill('input[placeholder="Family name"]', familyName);

    // Click the 'Save' button to confirm the dialog
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

  // Method to select the first element from the specified navigator (there are 5 the same) = indexing
  async selectFirstResourceType() {
    const firstElement = this.page.locator('#rdm-deposit-form .required.field.invenio-select-field > div').first();
    await firstElement.click(); // Or any other action you want to perform
  }

  // Method to select 'Resource type'
  async selectResourceType(currentlySelected: string | null) {
    const randomResourceType = testData.upload.resourceType(currentlySelected);
    await this.page.waitForTimeout(500);
    await this.page.click('#rdm-deposit-form .required.field.invenio-select-field > div');
    await this.page.waitForTimeout(500);
    await this.page.getByRole('option', { name: randomResourceType, exact: true }).click();
  }

  // Method to change 'Resource type'
  async changeResourceType(currentlySelected: string | null) {
    const changeResourceType = testData.upload.resourceType(currentlySelected);
    await this.page.waitForTimeout(1000);
    await this.page.click('#rdm-deposit-form .required.field.invenio-select-field > div');
    await this.page.getByRole('option', { name: changeResourceType, exact: true }).click();
  }

  // Method to fill the 'Publication date' with today's date in YYYY-MM-DD format
  async fillPublicationDateWithToday() {
    const today = testData.getTodayDate();  // Get today's date in YYYY-MM-DD format
    const publicationDateInput = this.page.locator('input[name="metadata.publication_date"]');
    await publicationDateInput.click({ delay: 100 });
    await publicationDateInput.fill(''); // Clear any existing text
    await this.page.waitForTimeout(500);
    await publicationDateInput.type(today); // Type the correctly formatted date
  }

  // Method to fill the 'Description' in the iframe
  async fillDescription(description: string) {
    const iframeElement = this.page.frameLocator('iframe[id^="tiny-react"]'); // Flexible selector for the iframe (ID starting with 'tiny-react')
    const body = iframeElement.first().locator('body#tinymce'); // Select the first iframe (if there are multiple) and then locate the body element inside the iframe
    await body.fill(description);
  }

  // Method to set the 'Embargo until' date field
  async setEmbargoUntilDate() {
    const embargoDate = testData.getDatePlusOne();  // Get today's date plus one day in YYYY-MM-DD format
    await this.page.fill('input[name="access.embargo.until"]', embargoDate);
  }

  // Method to fill the embargo reason with random text
  async fillEmbargoReason() {
    const reason = testData.randomEmbargoReason(); // Generate random reason
    await this.page.fill('textarea[name="access.embargo.reason"]', reason);
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click 'Save' button
  async clickSave() {
    await this.uiHelper.clickButtonByText('Save');
  }

  // Method to click 'Publish' button
  async clickPublish() {
    await this.page.click('button:has-text("Publish")');
  }

  // Method to click 'Edit' button
  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).click();
  }

  // Method to click the 'Save draft' button
  async clickSaveDraft() {
    await this.page.click('button[name="save"]');
  }

  // Method to click the 'Preview' button
  async clickPreview() {
    await this.page.click('button[name="preview"]');
  }

  // Method to click the 'Share' button
  async clickShare() {
    await this.page.click('//*[@id="rdm-deposit-form"]//button[contains(@class, "ui") and contains(@class, "icon") and contains(text(), "Share")]');
  }

  // Method to click 'Full record' -> 'Restricted' button
  async clickFullRecordRestrictedButton() {
    await this.page.click('(//button[@data-testid="protection-buttons-component-restricted"])[1]');
  }

  // Method to click 'Files only' -> 'Restricted' button
  async clickFilesOnlyRestrictedButton() {
    await this.page.click('(//button[@data-testid="protection-buttons-component-restricted"])[2]');
  }

  // Method to click the 'Discard changes' button
  async clickDiscardChanges() {
    await this.page.click("//div[@id='rdm-deposit-form']//button[contains(text(), 'Discard changes')]");
  }

  // Method to check the 'Apply an embargo' checkbox
  async checkEmbargoCheckbox() {
    const checkbox = await this.page.locator('div[data-testid="embargo-checkbox-component"] input[type="checkbox"]');
    await checkbox.click(); // Clicks the checkbox to check/uncheck it
  }

  // Method to click the 'Publish' button on the confirmation dialog
  async clickPublishOnConfirmation() {
    await this.page.waitForTimeout(500);
    // Wait for the modal to be visible
    const modalSelector = 'div.ui.small.modal.transition.visible.active';
    await this.page.waitForSelector(modalSelector, { state: 'visible' });
  
    // Wait for the 'Publish' button to be visible
    const publishButtonSelector = `${modalSelector} button.ui.positive.button`;
    const publishButton = await this.page.waitForSelector(publishButtonSelector, { state: 'visible' });
  
    // Log before clicking for debugging
    console.log('Clicking the Publish button...');
  
    // Click the 'Publish' button
    await publishButton.click();
  }

  // Method to click the 'Delete' record button
  async clickDeleteButton() {
    await this.page.locator('//button[contains(@class, "ui fluid icon left labeled button negative") and text()="Delete"]').click();
  }

  // Method to click the 'Delete' button in confirmation 'Are you sure you want to delete this draft?' dialog
  async clickDeleteButtonConfirm() {
    await this.page.locator('//button[contains(@class, "ui button negative")][.//text()="Delete"]').click();
  }

  // Method to close the modal dialog with class 'ui modal transition visible active' using the Esc key if it appears
  async closeModalDialogWithEscIfAppears() {
    const modal = this.page.locator('.ui.modal.transition.visible.active');

    // Check if the modal dialog is visible
    const isModalVisible = await modal.isVisible();

    if (isModalVisible) {
      // Press the Esc key to close the modal dialog
      await this.page.keyboard.press('Escape');
      console.log('Modal dialog closed with Esc key');
    } else {
      console.log('No modal dialog appeared');
  }
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

  // Method to count the number of uploaded files in the record
  async countUploadedFiles(): Promise<number> {
  const tableRows = this.page.locator('table.ui.striped.table.files.fluid.open tbody tr');
  const rowCount = await tableRows.count(); // Get the number of rows in the table body
  console.log(`Number of uploaded files: ${rowCount}`); // Optionally log the result
  return rowCount; // Return the count of rows (uploaded files)
  }

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}