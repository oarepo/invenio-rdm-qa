import { test, expect } from '../utils/fixtures';
import { testData } from '../data/testData';
import { urls } from '../data/urls';

test.describe('Login and Logout', () => {

  test('Login and navigate to profile', async ({ loginPage, page }) => {

    // Navigate and Login to the invenio RDM
    await page.goto(urls.baseURL);
    await loginPage.login(testData.email, testData.password);
    await expect(page).toHaveURL(urls.baseURL);  // Verify the base URL

    // Navigate to the profile page
    await loginPage.navigateToProfile();
    await expect(page).toHaveURL(urls.profileURL);  // Verify the profile URL

    // Logout from the Invenio RDM
    await loginPage.logout();
    await expect(page).toHaveURL(urls.baseURL);  // Check if redirected to the base URL after logout
  });

  // Login with incorrect credentials
  test('Login with random data (Faker)', async ({ loginPage, page }) => {
    await page.goto(urls.baseURL);
    await loginPage.login(testData.randomEmail(), testData.randomPassword());
    
    // Verify that an error message is displayed for invalid credentials
    await expect(page.getByText('Specified user does not exist')).toBeVisible(); 
  });
});