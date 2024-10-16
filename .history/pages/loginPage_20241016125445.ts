import { Page } from '@playwright/test';
import { UIHelper } from '../helpers/uiHelper';
import { urls } from '../data/urls';

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

  // Method to navigate to the login page
  async goto() {
    await this.uiHelper.goto('/login'); // Replace with the actual login URL
  }

  // Method to log in using email and password
  async login(email: string, password: string) {
    await this.uiHelper.clickByRole('link', ' Log in');
    await this.uiHelper.fillPlaceholder('Email Address', email);
    await this.uiHelper.fillPlaceholder('Password', password);
    await this.uiHelper.clickByRole('button', 'Log in');
  }

  // Method to log out from the application
  async logout() {
    await this.uiHelper.clickByRole('button', 'My account');
    await this.uiHelper.clickByRole('menuitem', ' Log out');
  }

  // Method to navigate to the profile page
  async navigateToProfile() {
    await this.uiHelper.clickByLabel('My account');
    await this.uiHelper.clickByRole('menuitem', ' Profile');
  }
  
  // Method to navigate to the My Dashboard page
  async navigateToMyDashboard() {
    await this.uiHelper.clickByText('My dashboard');
  }

}