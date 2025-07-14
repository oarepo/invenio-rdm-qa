import { Page } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';

/**
 * This class provides a structured abstraction for interacting with the Login page UI.
 * It allows consistent control of authentication actions and account-related navigation.
 *
 * ─────────────────────────────────────────────────────────────
 * INCLUDES:
 * ─────────────────────────────────────────────────────────────
 * 1. Interaction:
 *    - Log in with email and password via UIHelper helpers.
 *    - Log out through the user profile dropdown.
 *
 * 2. Navigation:
 *    - Navigate to the user profile page from the account menu.
 *
 * ─────────────────────────────────────────────────────────────
 * EXAMPLE USAGE:
 * ─────────────────────────────────────────────────────────────
 * const login = new LoginPage(page);
 * await login.navigateToProfile();
 * await login.logout();
 */

export class LoginPage {
  private uiHelper: UIHelper;

  constructor(private page: Page) {
    this.uiHelper = new UIHelper(page);
  }

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