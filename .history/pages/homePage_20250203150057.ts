import { Page, expect } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';
import { testData } from '../data/testData';
import { urls } from '../data/urls';

export class HomePage {
  private uiHelper: UIHelper;
  public uploadedTitle: string;

  constructor(private page: Page) {
    this.uiHelper = new UIHelper(page);
    this.uploadedTitle = testData.upload.recordTitle();
  }

// NAVIGATION --------------------------------------------------------------------------

  // Navigate to the homepage page using the helper
  async navigateToHome() {
    console.log('Navigating to the homepage...');
    await this.uiHelper.navigateToHome();
  }


// FIELDS ------------------------------------------------------------------------------

  // Method to fill in the search field
  async fillSearchField(query: string): Promise<void> {
    const searchInput = await this.page.locator('input[name="q"]');
    await searchInput.fill(query);
  }


// BUTTONS -----------------------------------------------------------------------------

  // Method to submit the search
  async submitSearch(): Promise<void> {
    const submitButton = await this.page.locator('button[type="submit"]');
    await submitButton.click();
  }

  // Method to select an option from the 'Sort by' dropdown menu
  // value specify directly in the test: 'Newest', 'Oldest', 'Best match'
  async selectSortOption(option: string): Promise<void> {
    // Open the dropdown
    const dropdown = await this.page.locator('(//div[@aria-label="Sort" and contains(@class, "ui selection dropdown")])[2]');
    await dropdown.click();
    // Wait for the options to be available
    const optionLocator = this.page.locator(`//div[contains(@class,"visible menu")]/div[@role="option"]/span[text()="${option}"]`);
  
  // Wait for the option to be visible before clicking it
  await optionLocator.waitFor({ state: 'visible' });

  // Click the option
  await optionLocator.click();
  }

// VERIFICATION ------------------------------------------------------------------------

  // Method to verify if the searched community name matches the expected name
  async verifyCommunityName(expectedName: string, index: number = 0): Promise<void> {
    const communityNameElement = await this.page.locator('a.ui.medium.header.mb-0').nth(index);
    const communityName = await communityNameElement.textContent();
  
    // Use expect to verify if the community name matches the expected name
    expect(communityName?.trim()).toBe(expectedName);
  }

  // Method to verify if the 'Sort by' was selected correctly
  // Define directly in the test
  async isSortOptionSelected(option: string): Promise<boolean> {
    const selectedTextLocator = this.page.locator('//div[@aria-label="Sort"]//div[contains(@class,"divider text")]').first();
    return await selectedTextLocator.textContent() === option;
  }
}