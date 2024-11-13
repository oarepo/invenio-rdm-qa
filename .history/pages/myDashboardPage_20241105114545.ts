import { Page, expect } from '@playwright/test';
import { FileUploadHelper } from '../helpers/fileUploadHelper';
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

// FIELDS ------------------------------------------------------------------------------



// BUTTONS -----------------------------------------------------------------------------

  // Method to click 'Edit' button in first record in the list
  async clickEdit() {
    await this.page.locator('(//button[contains(@class, "ui small compact icon right floated left labeled button") and .//text()="Edit"])[1]');
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}