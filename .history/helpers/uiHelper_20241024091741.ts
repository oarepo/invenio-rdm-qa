import { Page, expect } from '@playwright/test';
import { urls } from '../data/urls';

/**
 * Helpers:
 * Helpers are utility functions or classes designed to simplify and organize common
 * tasks within your test suite, such as interacting with UI elements, handling file uploads,
 * or generating test data. By abstracting repetitive code into helpers, you can maintain
 * cleaner test files and promote reusability. Helpers reduce duplication and make your
 * tests easier to maintain, improving overall test readability and structure.
 */

export class UIHelper {
  constructor(private page: Page) {}

  // -------------------------------------------------------------------------
  // NAVIGATION HELPERS
  // -------------------------------------------------------------------------

  // Navigate to the base URL (homepage)
  async navigateToHome() {
    await this.page.goto(urls.baseURL);
    await this.page.waitForURL(urls.baseURL);
  }

  // Navigate to the communities page
  async navigateToCommunities() {
    await this.page.goto(urls.communitiesURL);
    await this.page.waitForURL(urls.communitiesURL);
  }

  // Navigate to the My Dashboard page
  async navigateToMyDashboard() {
    await this.page.getByRole('link', { name: 'My dashboard' }).click();
  }

  // Navigate to the new community page
  async navigateToNewCommunity() {
    await this.page.goto(urls.newCommunityURL);
    await this.page.waitForURL(urls.newCommunityURL);
  }

  // Navigate to the detail of the first record
  async firstRecordDetail() {
    await this.page.waitForSelector('//a[contains(@href, "/records/")][1]', { state: 'visible' });
    await this.page.click('//a[contains(@href, "/records/")][1]');
  }

  // Navigate to a specific URL
  async goto(url: string) {
    await this.page.goto(url);
  }

  // -------------------------------------------------------------------------
  // OTHER UI HELPERS
  // -------------------------------------------------------------------------

  // Define valid roles using a union of string literals (can add more as needed)
  async clickByRole(role: 'button' | 'link' | 'checkbox' | 'heading' | 'menuitem' | 'textbox', name: string) {
    await this.page.getByRole(role, { name }).click();
  }

  // Implement clickByLabel to handle clicking elements by their label
  async clickByLabel(label: string) {
    await this.page.getByLabel(label).click();
  }

  // Fill an input field by its placeholder text
  async fillPlaceholder(placeholder: string, value: string) {
    await this.page.getByPlaceholder(placeholder).fill(value);
  }

  // Click an element by its text content with error handling
  async clickByText(text: string, retries: number = 3) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        await this.page.click(`text=${text}`);
        console.log(`Successfully clicked on text: ${text}`);
        break;
      } catch (error) {
        console.error(`Attempt ${attempt + 1} failed to click on text: ${text}`, error);
        if (attempt === retries - 1) {
          await this.captureScreenshotOnError(`clickByText_${text}`);
          throw error; // Re-throw after final attempt
        }
      }
    }
  }

  // Wait for a specific text to be visible on the page with optional timeout
  async waitForText(text: string, timeout: number = 30000): Promise<boolean> {
    try {
      await this.page.waitForSelector(`text=${text}`, { state: 'visible', timeout });
      return true;
    } catch (error) {
      console.error(`Text "${text}" not found within timeout`);
      return false;
    }
  }

  // Click a button based on its displayed text with error handling
  async clickButtonByText(buttonText: string) {
    try {
      await this.page.click(`text=${buttonText}`);
    } catch (error) {
      console.error(`Failed to click on button with text: ${buttonText}`, error);
      await this.captureScreenshotOnError(`clickButtonByText_${buttonText}`);
      throw error;
    }
  }

  // Wait for a specific element to become visible with optional timeout
  async waitForElement(selector: string, timeout: number = 30000) {
    try {
      await this.page.waitForSelector(selector, { state: 'visible', timeout });
    } catch (error) {
      console.error(`Element ${selector} not visible within timeout`, error);
      await this.captureScreenshotOnError(`waitForElement_${selector}`);
      throw error;
    }
  }

  // Check if an element is enabled on the page
  async isElementEnabled(selector: string): Promise<boolean> {
    try {
      return await this.page.isEnabled(selector);
    } catch (error) {
      console.error(`Failed to check if element ${selector} is enabled`, error);
      await this.captureScreenshotOnError(`isElementEnabled_${selector}`);
      throw error;
    }
  }

  // -------------------------------------------------------------------------
  // FORM HELPERS
  // -------------------------------------------------------------------------

  // Select an option in a dropdown by value
  async selectOptionByValue(selector: string, value: string) {
    try {
      await this.page.selectOption(selector, value);
    } catch (error) {
      console.error(`Failed to select option "${value}" from ${selector}`, error);
      await this.captureScreenshotOnError(`selectOptionByValue_${value}`);
      throw error;
    }
  }

  // Toggle a checkbox
  async toggleCheckbox(selector: string, check: boolean = true) {
    const isChecked = await this.page.isChecked(selector);
    if (isChecked !== check) {
      await this.page.check(selector);
    }
  }

  // -------------------------------------------------------------------------
  // SCREENSHOT AND ERROR HANDLING HELPERS
  // -------------------------------------------------------------------------

  // Capture a screenshot when an error occurs
  async captureScreenshotOnError(fileName: string) {
    try {
      const screenshotPath = `screenshots/${fileName}.png`;
      await this.page.screenshot({ path: screenshotPath });
      console.log(`Screenshot captured: ${screenshotPath}`);
    } catch (screenshotError) {
      console.error(`Failed to capture screenshot: ${screenshotError}`);
    }
  }

  // -------------------------------------------------------------------------
  // ASSERTION HELPERS
  // -------------------------------------------------------------------------

  // Assert that text is visible on the page
  async assertTextVisible(text: string) {
    const isVisible = await this.page.isVisible(`text=${text}`);
    if (!isVisible) {
      await this.captureScreenshotOnError(`assertTextVisible_${text}`);
    }
    expect(isVisible).toBe(true, `Expected text "${text}" to be visible.`);
  }
}
