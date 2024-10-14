import { test, expect, chromium } from '@playwright/test';

test('should log in successfully with specific resolution', async () => {
  // Launch the browser with the desired resolution
  const browser = await chromium.launch({
    headless: false, // Set to true if you want headless mode
  });

  // Create a new browser context with the desired viewport size
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, // Set the resolution
  });

  // Create a new page in the context
  const page = await context.newPage();

  // Navigate to the Invenio RDM login page
  await page.goto('https://inveniordm.web.cern.ch/');

  // Log in to Invenio RDM
  await page.getByRole('link', { name: ' Log in' }).click();
  await page.getByPlaceholder('Email Address').fill('petr.brablc@gmail.com');
  await page.getByPlaceholder('Password').fill('D@rgor23x');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByLabel('My account').click();
  await page.getByRole('menuitem', { name: ' Profile' }).click();

  // Assertion to ensure login is successful
  await expect(page).toHaveURL('https://inveniordm.web.cern.ch/account/settings/profile');

  await page.getByLabel('My account').click();
  await page.getByRole('menuitem', { name: ' Log out' }).click();

  // Add an assertion to confirm that logout was successful
  await expect(page).toHaveURL('https://inveniordm.web.cern.ch/');

  // Close the context and browser
  await context.close();
  await browser.close();
});