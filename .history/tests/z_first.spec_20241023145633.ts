/*

import { test, expect, chromium } from '@playwright/test';

test('test', async () => {
  // Launch Chromium, but force it to use the Google Chrome executable
  const browser = await chromium.launch({
    headless: false,  // Disable headless mode to visually see the browser
    channel: 'chrome',  // This tells Playwright to use Google Chrome instead of Chromium
  });

  // Set up a new context, including a fixed viewport size
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }, // Set a desktop resolution
    userAgent: 'your-chrome-user-agent-here', // Optional: use Chrome's exact user agent
  });

  const page = await context.newPage();

  // Navigate to Invenio RDM login page
  await page.goto('https://inveniordm.web.cern.ch/');
  
  // Perform login steps
  await page.getByRole('link', { name: ' Log in' }).click();
  await page.getByPlaceholder('Email Address').click();
  await page.getByPlaceholder('Email Address').fill('petr.brablc@gmail.com');
  await page.getByPlaceholder('Email Address').press('Tab');
  await page.getByPlaceholder('Password').fill('123456');
  await page.getByRole('button', { name: 'Log in' }).click();

  await page.getByRole('link', { name: 'My dashboard' }).click();
  await page.waitForTimeout(5000)

  await page.getByRole('link', { name: 'Validus synagoga utrimque quo' }).click();
  await page.getByLabel('Style').locator('i').click();
  await page.getByText('Harvard').click();
  await page.getByLabel('Export selection').locator('i').click();
  await page.getByRole('option', { name: 'JSON-LD' }).dblclick();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export' }).click();
  const download = await downloadPromise;
 

  // Close the browser after the test
  await browser.close();
});

*/