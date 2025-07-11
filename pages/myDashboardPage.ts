import { Page } from "@playwright/test";
import { UIHelper } from "../helpers/uiHelper";
import { testData } from "../data/testData";
import { urls } from "../data/urls";

export class MyDashboard {
  private uiHelper: UIHelper;
  public uploadedTitle: string;

  constructor(private page: Page) {
    this.uiHelper = new UIHelper(page);
    this.uploadedTitle = testData.upload.recordTitle();
  }

  // NAVIGATION --------------------------------------------------------------------------

  // Navigate to the homepage page using the helper
  async navigateToHome() {
    console.log("Navigating to the homepage...");
    await this.uiHelper.navigateToHome();
  }

  // Navigate to the 'Communities' page using the helper
  async navigateToCommunities() {
    console.log("Navigating to the Communities page...");
    await this.uiHelper.goto(urls.communitiesURL);
    await this.page.waitForSelector('h1:has-text("Communities")', {
      state: "visible",
    });
  }

  // Navigate to the 'My Dashboard' page using the helper
  async navigateToMyDashboard() {
    console.log('Navigating to "My Dashboard" page...');
    await this.uiHelper.navigateToMyDashboard();
  }

  // Navigate to the detail of the first record using the helper
  async firstRecordDetail() {
    console.log("Navigating to the first record detail page...");
    await this.uiHelper.firstRecordDetail();
  }

  // Navigate to the first community in the list of communities ('Communities' -> 'My communities' section)
  async navigateToFirstCommunity() {
    console.log("Navigating to the First Community detail...");
    await this.page.waitForSelector(
      "div.centered.image.fallback_image:nth-of-type(1)",
      { state: "visible" }
    );
    await this.page.locator("div.centered.image.fallback_image").nth(0).click();
    await this.page.waitForSelector('a.item.active:has-text("Records")', {
      state: "visible",
    });
  }

  // Navigate to the 'Communities' section
  async navigateToCommunitiesSection() {
    const communitiesButton = this.page.locator(
      'a.item[href="/me/communities"]'
    );
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
    const editButton = this.page.locator(
      '(//button[contains(@class, "ui small compact icon right floated left labeled button") and .//text()="Edit"])[1]'
    );
    await editButton.waitFor({ state: "visible" });
    await editButton.click();
    console.log("Clicked the Edit button for the first record.");
  }

  // Method to click 'Accept' button in 'Requests' section
  async clickAcceptButton(index: number): Promise<void> {
    const acceptButton = this.page
      .locator('button:has-text("Accept")')
      .nth(index);
    await acceptButton.waitFor({ state: "visible" });
    await acceptButton.click();
  }

  // Method to click 'Decline' button in 'Requests' section
  async clickDeclineButton(index: number): Promise<void> {
    const declineButton = this.page
      .locator('button:has-text("Decline")')
      .nth(index);
    await declineButton.waitFor({ state: "visible" });
    await declineButton.click();
  }

  // Method to check presence of 'Decline' button on the page
  async isDeclineButtonPresent(index: number): Promise<boolean> {
    return (
      (await this.page
        .locator('button:has-text("Decline")')
        .nth(index)
        .count()) > 0
    );
  }

  // Method to click confirmation 'Accept' button in 'Accept request' pop up dialog section (accept invitation to the community)
  async clickAcceptButtonConfirm(): Promise<void> {
    const acceptButton = this.page.locator(
      '#accept .actions > button.ui.icon.positive.left.labeled.button:has-text("Accept")'
    );
    await acceptButton.waitFor({ state: "visible" });
    await acceptButton.click();
  }

  // Method to click 'Decline' button in 'Decline request' pop up dialog section (decline invitation to the community)
  async clickDeclineButtonConfirm(): Promise<void> {
    const declineButton = this.page.locator(
      ".actions > button.ui.icon.negative.left.labeled.button",
      { hasText: "Decline" }
    );
    await declineButton.waitFor({ state: "visible" });
    await declineButton.click();
  }

  // Method to click the 'View all versions' toggle button
  async clickVersionsToggle(): Promise<void> {
    const toggleButtonLocator = this.page.locator(
      '(//div[@class="ui toggle checkbox"]/label)[2]'
    );
    await toggleButtonLocator.click();
  }

  // VERIFICATION ------------------------------------------------------------------------

  // Check if the record was deleted successfully
  async verifyRecordIsAbsent(recordTitle: string): Promise<boolean> {
    const recordLocator = this.page.locator(`text=${recordTitle}`);
    // Wait for the record to be absent in the UI
    const isAbsent = (await recordLocator.count()) === 0;

    // Log the verification status
    if (isAbsent) {
      console.log(`Verified the record with title "${recordTitle}" is absent.`);
    } else {
      console.log(
        `The record with title "${recordTitle}" was found in the list.`
      );
    }
    return isAbsent;
  }

  // Method to check if the 'All done!' message is present on the page (My dashboard -> Requests)
  async isAllDoneMessagePresent(): Promise<boolean> {
    const allDoneMessage = this.page.locator(
      "div.ui.placeholder.center.aligned.segment h1.ui.icon.header",
      { hasText: "All done!" }
    );
    return await allDoneMessage.isVisible();
  }

  // Method to check the presence of the 'New version draft' label
  async isNewVersionDraftLabelPresent(): Promise<boolean> {
    try {
      await this.page.waitForSelector('text="New version draft"', {
        state: "visible",
        timeout: 5000,
      });
      console.log("'New version draft' label is visible.");
      return true;
    } catch (error) {
      console.log("'New version draft' label is not visible.");
      return false;
    }
  }

  // Method to check records and search for a record saved in a variable in the test
  async isRecordTitleMatching(title: string): Promise<boolean> {
    const recordLinks = this.page.locator("a.truncate-lines-2");

    await recordLinks.first().waitFor({ state: "visible", timeout: 5000 });

    const count = await recordLinks.count();
    console.log(`Found ${count} records to check.`);

    for (let i = 0; i < count; i++) {
      const recordText = await recordLinks.nth(i).textContent();

      if (recordText) {
        const trimmedText = recordText.trim();
        const isMatch = trimmedText === title;

        // Log the comparison result
        console.log(`Comparing "${title}" with "${trimmedText}": ${isMatch}`);

        if (isMatch) {
          return true;
        }
      } else {
        console.log(`Record text at index ${i} is empty or not found.`);
      }
    }
    console.log(`No matching record found for title: "${title}"`);
    return false;
  }

  // Method for implicit waiting (2 seconds)
  async waitForTwoSeconds() {
    await this.page.waitForTimeout(2000); // Waits for 2 seconds
  }
}
