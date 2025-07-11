import { Page } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';

export class LoginPage {
  private uiHelper: UIHelper;

  constructor(private page: Page) {
    this.uiHelper = new UIHelper(page);
  }

/**
 * Page Objects:
 * Page Objects represent web pages or components within your application, providing a structured
 * and organized way to interact with UI elements. They encapsulate actions like clicking buttons,
 * filling forms, and navigating through pages. By centralizing all element selectors and user actions
 * related to a specific page in one class, Page Objects make your tests more maintainable, reusable, 
 * and easier to read, reducing duplication and allowing for quick updates when the UI changes.
 */

  // Method to log in using email and password
  async login(email: string, password: string) {
    await this.uiHelper.clickByRole('link', 'Log in');
    await this.uiHelper.fillPlaceholder('Email Address', email);
    await this.uiHelper.fillPlaceholder('Password', password);
    await this.uiHelper.clickByRole('button', 'Log in');
  }

  // Method to log out from the application
  async logout() {
    const profileButton = this.page.locator('#user-profile-dropdown-btn');
    await profileButton.waitFor({ state: 'visible', timeout: 5000 });
    await profileButton.click();
  
    const logoutMenuItem = this.page.getByRole('menuitem', { name: 'Log out' });
    await logoutMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await logoutMenuItem.click();
  }

  // Method to navigate to the profile page
  async navigateToProfile() {
    await this.uiHelper.clickByLabel('My account');
    await this.uiHelper.clickByRole('menuitem', 'Profile');
  }
}