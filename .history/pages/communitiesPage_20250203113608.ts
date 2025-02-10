import { Page } from '@playwright/test';
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

 // Method to submit the search (optional)
 async submitSearch(): Promise<void> {
  const submitButton = await this.page.locator('button[type="submit"]');
  await submitButton.click();
}

// VERIFICATION ------------------------------------------------------------------------

  
}