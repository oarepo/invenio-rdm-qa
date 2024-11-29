import { Page } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';
import { testData } from '../data/testData';

export class MyDashboard {
  private uiHelper: UIHelper;
  public uploadedTitle: string;

  constructor(private page: Page) {
    this.uiHelper = new UIHelper(page);
    this.uploadedTitle = testData.upload.recordTitle();
  }

// -------------------------------------------------------------------------------------
//  UPLOADS
// -------------------------------------------------------------------------------------

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

  // Navigate to the 'Requests' section
  async navigateToRequests() {
    const requestsButton = this.page.locator('a:has-text("Requests")');
    await requestsButton.click();
  }

// FIELDS ------------------------------------------------------------------------------



// BUTTONS -----------------------------------------------------------------------------

  // Method to click 'Edit' button in first record in the list
  async clickEditButton() {
    const editButton = this.page.locator('(//button[contains(@class, "ui small compact icon right floated left labeled button") and .//text()="Edit"])[1]');
    await editButton.waitFor({ state: 'visible' });
    await editButton.click();
    console.log('Clicked the Edit button for the first record.');
  }

  // Method to click 'Accept' button in 'Requests' section (accept invitation to the community)
  async clickAcceptButton(index: number): Promise<void> {
    const acceptButton = this.page.locator('button:has-text("Accept")').nth(index);
    await acceptButton.scrollIntoViewIfNeeded(); // Ensure the button is in view
    await acceptButton.waitFor({ state: 'visible' }); // Wait until the button is visible
    await acceptButton.click(); // Click the button
  }

// VERIFICATION ------------------------------------------------------------------------

  // Check if the record was deleted successfully
  async verifyRecordIsAbsent(recordTitle: string): Promise<boolean> {
    const recordLocator = this.page.locator(`text=${recordTitle}`);
    // Wait for the record to be absent in the UI
    const isAbsent = await recordLocator.count() === 0;
    
    // Log the verification status
    if (isAbsent) {
      console.log(`Verified the record with title "${recordTitle}" is absent.`);
    } else {
      console.log(`The record with title "${recordTitle}" was found in the list.`);
    }
    return isAbsent;
  }
}