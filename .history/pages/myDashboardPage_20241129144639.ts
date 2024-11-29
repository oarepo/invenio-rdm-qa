import { Page } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';
import { testData } from '../data/testData';
import { urls } from '../data/urls';

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

  // Navigate to the 'Communities' section
  async navigateToCommunities() {
    const communitiesButton = this.page.locator('a.item[href="/me/communities"]');
    await communitiesButton.click();
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

  // Method to click 'Accept' button in 'Requests' section 
  async clickAcceptButton(index: number): Promise<void> {
    const acceptButton = this.page.locator('button:has-text("Accept")').nth(index);
    await acceptButton.waitFor({ state: 'visible' });
    await acceptButton.click();
  }

  // Method to click confirmation 'Accept' button in 'Accept request' pop up dialog section (accept invitation to the community)
  async clickAcceptButtonConfirm(): Promise<void> {
    const acceptButton = this.page.locator('#accept .actions > button.ui.icon.positive.left.labeled.button:has-text("Accept")');
    await acceptButton.waitFor({ state: 'visible' });
    await acceptButton.click();
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

  // Save a first request from the list of requests
  async saveInvitationTextInQuotes(index: number): Promise<string | null> {
    // Locate the header elements and extract the text content at the specified index
    const invitationTextElement = this.page.locator('.header.truncate-lines-2.false .header-link').nth(index);
    const fullText = await invitationTextElement.innerText();
  
    console.log('Full text extracted from the element:', fullText);
  
    // Use a regular expression to extract text within quotes
    const match = fullText.match(/"([^"]+)"/);
  
    if (match) {
      console.log('Extracted text within quotes:', match[1]);
      return match[1]; // The text within the quotes
    } else {
      console.log('No match found for text within quotes.');
      return null; // No match found
    }
  }

  // Check if the expected text is present on the page
  async isInvitationTextPresentOnPage(expectedText: string): Promise<boolean> {
  // Locate all header elements and check if any of them contain the expected text
  const elements = this.page.locator('.header.truncate-lines-2.false .header-link');
  const count = await elements.count();
  console.log('Total number of elements found:', count);
  
  for (let i = 0; i < count; i++) {
    const elementText = await elements.nth(i).innerText();
    console.log(`Text content of element ${i}:`, elementText);
    
      if (elementText.includes(expectedText)) {
        console.log('Expected text found in element', i);
        return true; // The expected text is found in this element
      }
    }
  
    console.log('Expected text was not found in any element.');
    return false; // The expected text was not found in any of the elements
  }

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}