import { test, expect } from '../../utils/fixtures';
import { testData } from '../../data/testData';
import { urls } from '../../data/urls';


test.describe('Login and Logout', () => {

  test('Login and navigate to profile', async ({ loginPage, page }) => {

    /*
     //Parameters for sending to the Qase
     const qaseData = {
      case_id: '',
      severity: 'critical',  // Explicit string value for severity
      priority: 'high',   // Explicit string value for priority
      description: 'description test',    // Set empty string to avoid null values
      preconditions: 'precondition test',  // Set empty string to avoid null values
      postconditions: '',  // Set empty string to avoid null values
      duration: 0,        // To be set after execution
      status: 'blocked',   // Initial status to be updated later
      environment: { browser: 'Chrome', resolution: '1920x1080', os: 'MAC OSX' },
      attachments: [],     // To store any screenshot paths
      automated: true,    // Marks as an automated test
      tags: ['E2E', 'Upload'],  // Tags for categorization
    };

    // Debug log to check the data being sent to Qase
    console.log("Qase Payload:", JSON.stringify(qaseData));
    */

    // Navigate and Login to the invenio RDM
    await page.goto(urls.baseURL);
    await page.waitForLoadState('networkidle');
    await loginPage.login(testData.email, testData.password);
    await expect(page).toHaveURL(urls.baseURL);  // Verify the base URL

    // Navigate to the profile page
    await loginPage.navigateToProfile();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(urls.profileURL);  // Verify the profile URL

    // Logout from the Invenio RDM
    await loginPage.logout();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(urls.baseURL);  // Check if redirected to the base URL after logout
  });

  // Login with incorrect credentials
  test('Login with incorrect data (Faker)', async ({ loginPage, page }) => {
    await page.goto(urls.baseURL);
    await loginPage.login(testData.randomEmail(), testData.randomPassword());
    
    // Verify that an error message is displayed for invalid credentials
    await expect(page.getByText('Specified user does not exist')).toBeVisible(); 
  });
});