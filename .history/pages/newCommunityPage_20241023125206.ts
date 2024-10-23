import { Page } from '@playwright/test';
import { FileUploadHelper } from '../helpers/fileUploadHelper';
import { UIHelper } from '../helpers/uiHelper';
import { urls } from '../data/urls';
import { testData } from '../data/testData';

export class newCommunity {
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

  // Navigate to the 'Communities' page using the helper
  async navigateToCommunities() {
    await this.uiHelper.navigateToCommunities();
  }

  // Navigate to the 'My Dashboard' page using the helper
  async navigateToMyDashboard() {
    await this.uiHelper.navigateToMyDashboard();
  }

  // Navigate to the "new community" page using the helper
  async navigateToNewCommunity () {
    await this.uiHelper.navigateToNewCommunity();
  }

  // Navigate to the detail of the first record using the helper
  async firstRecordDetail() {
    await this.uiHelper.firstRecordDetail();
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

  // Method to click the 'New community' button
  async clickNewCommunity() {
    await this.page.getByRole('button', { name: 'New community' }).click();
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}