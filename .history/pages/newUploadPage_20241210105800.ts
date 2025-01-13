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
    console.log('Navigating to the homepage...');
    await this.uiHelper.navigateToHome();
  }

  // Navigate to the new upload section using the generic goto helper
  async navigateToUploadSection() {
    console.log('Navigating to the upload section...');
    await this.uiHelper.goto(urls.newUploadURL); 
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

// FIELDS ------------------------------------------------------------------------------

  // Method to check 'Metadata-only record' checkbox
  async checkFirstMetadataOnlyCheckbox() {
    const checkboxLocator = this.page.locator('label', { hasText: 'Metadata-only record' });
    await checkboxLocator.waitFor({ state: 'visible' });
    await checkboxLocator.click();
  }

  // Method to upload a random file using the helper
  async uploadRandomFile() {
    await this.fileUploadHelper.uploadRandomFile();
  }

  // Method to fill the record 'Title'
  async fillTitle(title: string) {
    this.uploadedTitle = title; // Store the title here
    const titleLocator = this.page.locator('input[id="metadata.title"]');
    await titleLocator.waitFor({ state: 'visible' });
    await titleLocator.fill(title);
  }

  // Method to fill 'Family name' (or 'Creators' name) and confirm the dialog
  async fillFamilyName(familyName: string) {
    // Click the 'Add creator' button
    const addCreatorButton = this.page.getByRole('button', { name: 'Add creator' });
    await addCreatorButton.click();

    // Wait for the pop-up dialog to appear
    const familyNameInputLocator = this.page.waitForSelector('input[placeholder="Family name"]');
    await familyNameInputLocator;

    // Fill in the 'Family name'
    await this.page.fill('input[placeholder="Family name"]', familyName);

    // Wait for the 'Save' button to be clickable and then click
    const saveButton = this.page.locator('body > div.ui.top.aligned.page.modals.dimmer.transition.visible.active > div > div.actions > button:nth-child(3)');
    await saveButton.waitFor({ state: 'visible' });
    await saveButton.click();
  }

  // Method to select DOI option
  async selectDOIOption(isDOIRequired: boolean) {
    await this.page.getByText('No', { exact: true }).first().click();

    if (isDOIRequired) {
      const doiButtonLocator = this.page.locator('text="Get a DOI now!"');
      await doiButtonLocator.waitFor({ state: 'visible' });
      await doiButtonLocator.click();
    }
  }

  // Method to select the first element from the specified navigator (there are 5 the same) = indexing
  async selectFirstResourceType() {
    const firstElement = this.page.locator('#rdm-deposit-form .required.field.invenio-select-field > div').first();
    await firstElement.waitFor({ state: 'visible' });
    await firstElement.click();
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
    await body.waitFor({ state: 'visible' });
    await body.fill(description);
  }

  // Method to set the 'Embargo until' date field
  async setEmbargoUntilDate() {
    const embargoDate = testData.getDatePlusOne();  // Get today's date plus one day in YYYY-MM-DD format
    const embargoDateInput = this.page.locator('input[name="access.embargo.until"]');
    await embargoDateInput.waitFor({ state: 'visible' });
    await embargoDateInput.fill(embargoDate);  
  }

  // Method to fill the embargo reason with random text
  async fillEmbargoReason() {
    const reason = testData.randomEmbargoReason(); // Generate random reason
    const embargoReasonTextarea = this.page.locator('textarea[name="access.embargo.reason"]');
    await embargoReasonTextarea.waitFor({ state: 'visible' });
    await embargoReasonTextarea.fill(reason);
  }

  // Method to fill in the 'User' field ('Add people' pop-up dialog).
  async fillUser(): Promise<void> {
    const userEmail = testData.existingUserEmail;
    const comboboxLocator = this.page.locator('i.search.icon[aria-hidden="true"]');
    await comboboxLocator.click();
    await comboboxLocator.fill(userEmail);
    await comboboxLocator.press('Enter');
  }

  // Method to interact with the combobox and fill in text
  async interactWithCombobox(): Promise<void> {
    // Locate the combobox parent container using the text element as a reference
    const comboboxContainer = this.page.locator('div[role="combobox"].ui.fluid.multiple.search.selection.dropdown');
    const inputLocator = comboboxContainer.locator('input.search');
    const searchIconLocator = comboboxContainer.locator('i.search.icon');
    const searchText = 'example@domain.com'; // Replace with the actual text to input

    // Click the search icon to activate the combobox
    await searchIconLocator.click();

    // Wait until the combobox is expanded
    await this.page.waitForSelector('div[role="combobox"][aria-expanded="true"]', { state: 'visible' });

    // Fill in the search text
    await inputLocator.fill(searchText);

    // Simulate pressing Enter to search or add the input
    await inputLocator.press('Enter');
  }

// BUTTONS -----------------------------------------------------------------------------

  // Method to click 'Save' button
  async clickSave() {
    await this.page.waitForSelector('button:has-text("Save")', { state: 'visible' });
    await this.uiHelper.clickButtonByText('Save');
  }

  // Method to click 'Publish' button
  async clickPublish() {
    await this.page.waitForSelector('button:has-text("Publish")', { state: 'visible' });
    await this.page.click('button:has-text("Publish")');
  }

  // Method to click 'Edit' button
  async clickEdit() {
    await this.page.getByRole('button', { name: 'Edit' }).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'Edit' }).click();
  }

  // Method to click the 'Save draft' button
  async clickSaveDraft() {
    await this.page.waitForSelector('button[name="save"]', { state: 'visible' });
    await this.page.click('button[name="save"]');
  }

  // Method to click the 'Preview' button
  async clickPreview() {
    await this.page.click('button[name="preview"]');
  }

  // Method to click the 'Share' button
  async clickShare() {
    const button = await this.page.locator('//*[@id="rdm-deposit-form"]//button[contains(@class, "ui") and contains(@class, "icon") and contains(text(), "Share")]');
    await button.waitFor({ state: 'visible' });
    await button.click();
  }

  // Method to click the 'Add People' button
  async clickAddPeopleButton(): Promise<void> {
    const addPeopleButton = this.page.locator('th.center.aligned.three.wide button:has-text("Add people")');
    await addPeopleButton.click();
  }

  // Method to click the 'Select a community' button
  async clickSelectCommunityButton() {
    const button = await this.page.locator('button[name="setting"]');
    await button.waitFor({ state: 'visible' });
    await button.click();
    console.log('Clicked the "Select a community" button.');
  }

  // Method to click the 'My communities' tab button ('Select a community' pop-up window)
  async clickMyCommunitiesTab() {
    const tab = await this.page.locator('#my-communities-tab');
    await tab.waitFor({ state: 'visible' });
    await tab.click();
    console.log('Clicked the "My communities" tab button.');
  }

  // Method to click the 'Select' button ('Select a community' pop-up window)
  async clickSelectButton(communityName: string) {
    const button = this.page.getByRole('button', { name: `Select ${communityName}` });

    try {
        await button.waitFor({ state: 'visible', timeout: 10000 });

        // Confirm the button is enabled before attempting to click
        const isEnabled = await button.isEnabled();
        if (!isEnabled) {
            throw new Error(`The "Select ${communityName}" button is not enabled.`);
        }

        await button.click();
        console.log(`Clicked the "Select ${communityName}" button successfully.`);
    } catch (error) {
        console.error(`Failed to click the "Select ${communityName}" button: ${error.message}`);
        throw error;
    }
}

  // Method to click the 'Submit for review' button ('Select a community' pop-up window)
  async clickSubmitReviewButton() {
    const button = await this.page.locator('button[name="SubmitReview"]');
    await button.waitFor({ state: 'visible' });
    await button.click();
    console.log('Clicked the "Submit for review" button.');
  }

  // Method to click the accept access to record checkbox ('Submit for review' pop-up dialog)
  async clickAcceptAccessToRecord() {
    await this.page.waitForSelector('label[for="acceptAccessToRecord"]');
    await this.page.click('label[for="acceptAccessToRecord"]');
  }

  // Method to click the accept publish record checkbox ('Submit for review' pop-up dialog)
  async clickAcceptPublishRecord() {
    await this.page.waitForSelector('label[for="acceptAfterPublishRecord"]');
    await this.page.click('label[for="acceptAfterPublishRecord"]');
  }

  // Method to click the 'Submit record for review' button inside the pop-up dialog
  async clickSubmitReviewButtonConfirm() {
    await this.page.waitForSelector('div.actions button[name="submitReview"]');
    await this.page.locator('div.actions button[name="submitReview"]').click();
  }

  // Method to click the 'Accept and publish' button
  async clickAcceptAndPublishButton() {
    await this.page.waitForSelector('button:has-text("Accept and publish")');
    await this.page.locator('button:has-text("Accept and publish")').click();
  }

  // Method to click confirmation 'Accept and publish' button inside the pop-up dialog
  async clickConfirmationAcceptAndPublishButton() {
    await this.page.waitForSelector('button:has-text("Accept and publish")');
    await this.page.locator('button:has-text("Accept and publish")').nth(1).click();
  }

  // Method to click 'Full record' -> 'Restricted' button (Visibility section)
  async clickFullRecordRestrictedButton() {
    await this.page.waitForSelector('(//button[@data-testid="protection-buttons-component-restricted"])[1]');
    await this.page.click('(//button[@data-testid="protection-buttons-component-restricted"])[1]');
  }

  // Method to click 'Files only' -> 'Restricted' button (Visibility section)
  async clickFilesOnlyRestrictedButton() {
   // await this.page.waitForSelector('(//button[@data-testid="protection-buttons-component-restricted"])[2]');
    await this.page.click('(//button[@data-testid="protection-buttons-component-restricted"])[2]');
  }

  // Method to click the 'Discard changes' button
  async clickDiscardChanges() {
    await this.page.waitForSelector("//div[@id='rdm-deposit-form']//button[contains(text(), 'Discard changes')]");
    await this.page.click("//div[@id='rdm-deposit-form']//button[contains(text(), 'Discard changes')]");
  }

  // Method to check the 'Apply an embargo' checkbox
  async checkEmbargoCheckbox() {
    const checkbox = await this.page.locator('label.header[for="access.embargo.active"]');
    await checkbox.waitFor({ state: 'visible' });
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
    console.log('Clicking the Publish button...');
  
    // Click the 'Publish' button
    await publishButton.click();
  }

  // Method to click the 'Delete' record button
  async clickDeleteButton() {
    await this.page.waitForSelector('//button[contains(@class, "ui fluid icon left labeled button negative") and text()="Delete"]'); 
    await this.page.locator('//button[contains(@class, "ui fluid icon left labeled button negative") and text()="Delete"]').click();
  }

  // Method to click the 'Delete' button in confirmation 'Are you sure you want to delete this draft?' dialog
  async clickDeleteButtonConfirm() {
    await this.page.waitForSelector('//button[contains(@class, "ui button negative")][.//text()="Delete"]');
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

  // Method to verify specific validation error messages
  async verifyValidationErrors() {
    const resourceTypeError = this.page.locator('div.left.aligned.fifteen.wide.column ul.list li.content', { hasText: 'Resource type' });
    const creatorsError = this.page.locator('div.left.aligned.fifteen.wide.column ul.list li.content', { hasText: 'Creators' });
    const titleError = this.page.locator('div.left.aligned.fifteen.wide.column ul.list li.content', { hasText: 'Title' });
    const doiError = this.page.locator('div.left.aligned.fifteen.wide.column ul.list li.content', { hasText: 'DOI' });

    // Validate each specific error message is present
    await expect(resourceTypeError).toBeVisible();
    await expect(creatorsError).toBeVisible();
    await expect(titleError).toBeVisible();
    await expect(doiError).toBeVisible();

    console.log('All required validation error messages are displayed');
  }

  // Method to verify if the 'Metadata-only' label is present
  async verifyMetadataOnlyLabel() {
    const metadataLabel = this.page.locator('span.metadata-only >> span:has-text("Metadata-only")');
    await expect(metadataLabel).toBeVisible();
  }

  // Method to verify the presence of the confirmation element ('Submitted' status in record request)
  async verifySubmittedStatusPresence() {
    const submittedElement = await this.page.locator('i.clock.outline.icon + span:has-text("Submitted")');
    const isVisible = await submittedElement.isVisible();
    return isVisible;
  }

  // Method to verify the presence of the confirmation element ('Accept' status in record request)
  async verifyConfirmationStatusPresence() {
    const confirmationElement = await this.page.locator('i.check.circle.icon + span:has-text("Accepted")');
    const isVisible = await confirmationElement.isVisible();
    return isVisible;
  }

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}