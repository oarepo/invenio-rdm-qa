import { Page } from '@playwright/test';

/**
 * Helpers:
 * Helpers are utility functions or classes designed to simplify and organize common
 * tasks within your test suite, such as interacting with UI elements, handling file uploads,
 * or generating test data. By abstracting repetitive code into helpers, you can maintain
 * cleaner test files and promote reusability. Helpers reduce duplication and make your
 * tests easier to maintain, improving overall test readability and structure.
 */

// Helper provides utility methods for common UI interactions

export class UIHelper {
  constructor(private page: Page) {}

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

  // Click an element by its text content
  async clickByText(text: string) {
    await this.page.click(`text=${text}`);
  }

  // Wait for a specific text to be visible on the page and return its visibility status
  async waitForText(text: string): Promise<boolean> {
    return await this.page.getByText(text).isVisible();
  }

  // Click a button based on its displayed text
  async clickButtonByText(buttonText: string) {
    await this.page.click(`text=${buttonText}`);
  }

  // Wait for a specific element to become visible on the page
  async waitForElement(selector: string) {
    await this.page.waitForSelector(selector, { state: 'visible' });
  }

  // Check if an element is enabled on the page
  async isElementEnabled(selector: string): Promise<boolean> {
    return await this.page.isEnabled(selector);
  }
}