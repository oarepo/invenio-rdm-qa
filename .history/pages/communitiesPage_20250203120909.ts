import { Page, expect } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';
import { testData } from '../data/testData';
import { urls } from '../data/urls';

export class Communities {
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

  // Navigate to the 'Communities' page using the helper
  async navigateToCommunities() {
    console.log('Navigating to the Communities page...');
    await this.uiHelper.goto(urls.communitiesURL);
    await this.page.waitForSelector('h1:has-text("Communities")', { state: 'visible' });
  }

  // Navigate to the first community in the list of communities ('Communities' -> 'My communities' section)
  async navigateToFirstCommunity() {
    console.log('Navigating to the First Community detail...');
    await this.page.waitForSelector('div.centered.image.fallback_image:nth-of-type(1)', { state: 'visible' });
    await this.page.locator('div.centered.image.fallback_image').nth(0).click();
    await this.page.waitForSelector('a.item.active:has-text("Records")', { state: 'visible' });
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
    const dropdown = await this.page.locator('//div[@aria-label="Sort" and contains(@class, "ui selection dropdown")]');
    await dropdown.click();
    const optionLocator = await this.page.locator(`div.menu div.item:has-text("${option}")`);
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
}